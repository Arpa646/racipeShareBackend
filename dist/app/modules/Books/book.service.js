"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("./book.model"));
const createBook = (bookData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newBook = yield book_model_1.default.create([bookData], { session });
        yield session.commitTransaction();
        session.endSession();
        return newBook;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getAllBooksFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.default.find({ isDeleted: false })
        .populate("user")
        .populate("genre");
    return result;
});
const getBookByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.default.findOne({ _id: id, isDeleted: false })
        .populate("user")
        .populate("genre");
    return result;
});
const deleteBookInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    return result;
});
const updateBook = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.findById(id);
        if (!book) {
            return null;
        }
        // Update book fields
        if (updatedData.title !== undefined)
            book.title = updatedData.title;
        if (updatedData.author !== undefined)
            book.author = updatedData.author;
        if (updatedData.description !== undefined)
            book.description = updatedData.description;
        if (updatedData.isbn !== undefined)
            book.isbn = updatedData.isbn;
        if (updatedData.coverImage !== undefined)
            book.coverImage = updatedData.coverImage;
        if (updatedData.publishedDate !== undefined)
            book.publishedDate = updatedData.publishedDate;
        if (updatedData.genre !== undefined)
            book.genre = updatedData.genre;
        if (updatedData.pages !== undefined)
            book.pages = updatedData.pages;
        const updatedBook = yield book.save();
        // Populate genre before returning
        yield updatedBook.populate("genre");
        yield updatedBook.populate("user");
        return updatedBook;
    }
    catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
});
const searchBooks = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genres, minRating, maxRating, sortBy = "createdAt" } = filters;
        // Build base query
        const query = {
            isDeleted: false,
            isPublished: true,
        };
        // Title filter (case-insensitive)
        if (title && title.trim()) {
            query.title = { $regex: title.trim(), $options: "i" };
        }
        // Author filter (case-insensitive)
        if (author && author.trim()) {
            query.author = { $regex: author.trim(), $options: "i" };
        }
        // Genre filter - handle multiple genre IDs (comma-separated or array)
        if (genres) {
            let genreArray = [];
            if (typeof genres === "string") {
                // Handle comma-separated string: "genreId1,genreId2,genreId3"
                genreArray = genres.split(",").map((g) => g.trim()).filter((g) => g.length > 0);
            }
            else if (Array.isArray(genres)) {
                // Handle array: ["genreId1", "genreId2", "genreId3"]
                genreArray = genres.map((g) => String(g).trim()).filter((g) => g.length > 0);
            }
            if (genreArray.length > 0) {
                // Convert to ObjectIds for querying
                const genreObjectIds = genreArray.map((id) => new mongoose_1.default.Types.ObjectId(id));
                // Use $in to match any of the genre IDs
                query.genre = { $in: genreObjectIds };
            }
        }
        // Get all books matching the filters
        let books = yield book_model_1.default.find(query)
            .populate("user", "name email")
            .populate("genre")
            .lean();
        // Calculate average ratings from reviews if rating filters are provided
        if (minRating !== undefined || maxRating !== undefined || sortBy === "rating") {
            const ReviewModel = mongoose_1.default.model("Review");
            // Get all book IDs
            const bookIds = books.map((book) => book._id);
            // Aggregate ratings from reviews
            const ratingAggregation = yield ReviewModel.aggregate([
                {
                    $match: {
                        bookId: { $in: bookIds },
                        status: "approved",
                        isDeleted: false,
                    },
                },
                {
                    $group: {
                        _id: "$bookId",
                        averageRating: { $avg: "$rating" },
                        totalRatings: { $sum: 1 },
                    },
                },
            ]);
            // Create a map of bookId to rating
            const ratingMap = new Map();
            ratingAggregation.forEach((item) => {
                ratingMap.set(item._id.toString(), {
                    averageRating: Math.round(item.averageRating * 10) / 10, // Round to 1 decimal
                    totalRatings: item.totalRatings,
                });
            });
            // Add ratings to books
            books = books.map((book) => {
                const ratingData = ratingMap.get(book._id.toString());
                return Object.assign(Object.assign({}, book), { averageRating: (ratingData === null || ratingData === void 0 ? void 0 : ratingData.averageRating) || 0, totalRatings: (ratingData === null || ratingData === void 0 ? void 0 : ratingData.totalRatings) || 0 });
            });
            // Filter by rating range
            if (minRating !== undefined) {
                books = books.filter((book) => book.averageRating >= minRating);
            }
            if (maxRating !== undefined) {
                books = books.filter((book) => book.averageRating <= maxRating);
            }
            // Sort by rating if requested
            if (sortBy === "rating") {
                books.sort((a, b) => {
                    if (b.averageRating !== a.averageRating) {
                        return b.averageRating - a.averageRating;
                    }
                    return b.totalRatings - a.totalRatings; // Secondary sort by number of ratings
                });
            }
        }
        // Sort by other fields
        if (sortBy !== "rating") {
            const sortOrder = sortBy === "title" ? 1 : -1;
            books.sort((a, b) => {
                if (sortBy === "title") {
                    return a.title.localeCompare(b.title) * sortOrder;
                }
                if (sortBy === "createdAt" || sortBy === "updatedAt") {
                    return (new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime()) * sortOrder;
                }
                return 0;
            });
        }
        return books;
    }
    catch (error) {
        console.error("Error searching books:", error);
        throw error;
    }
});
exports.BookServices = {
    createBook,
    getAllBooksFromDB,
    getBookByIdFromDB,
    deleteBookInDB,
    updateBook,
    searchBooks,
};
