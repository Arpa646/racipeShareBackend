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
exports.BookController = void 0;
const asynch_1 = __importDefault(require("../../middleware/asynch"));
const response_1 = __importDefault(require("../../utils/response"));
const http_status_codes_1 = require("http-status-codes");
const book_service_1 = require("./book.service");
const createBook = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, author, description, isbn, coverImage, publishedDate, genre, pages } = req.body;
    // Get userId from token (req.user.useremail contains the ObjectId)
    const DEFAULT_USER_ID = "673a0ad83e3e75c0f3804dab";
    let userId;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.useremail) {
        // useremail in token contains the user ObjectId
        userId = req.user.useremail.toString();
        console.log("✅ User ID from token:", userId);
    }
    else {
        // Fall back to default if token not present
        userId = DEFAULT_USER_ID;
        console.log("⚠️  No token found, using default userId:", userId);
    }
    const bookData = {
        title,
        author,
        description,
        isbn,
        coverImage,
        publishedDate: publishedDate ? new Date(publishedDate) : undefined,
        genre,
        pages,
        user: userId,
        isDeleted: false,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    console.log(bookData);
    const result = yield book_service_1.BookServices.createBook(bookData);
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Book created successfully",
        data: result,
    });
}));
const getAllBooks = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.BookServices.getAllBooksFromDB();
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.length > 0
            ? "Books retrieved successfully"
            : "No books found",
        data: result,
    });
}));
const searchBooks = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, genres, minRating, maxRating, sortBy } = req.query;
    const filters = {};
    if (title && typeof title === "string")
        filters.title = title;
    if (author && typeof author === "string")
        filters.author = author;
    // Handle genres - can be string (comma-separated) or array
    if (genres) {
        filters.genres = genres;
    }
    if (minRating)
        filters.minRating = parseFloat(minRating);
    if (maxRating)
        filters.maxRating = parseFloat(maxRating);
    if (sortBy && typeof sortBy === "string") {
        filters.sortBy = sortBy;
    }
    const books = yield book_service_1.BookServices.searchBooks(filters);
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: books.length > 0
            ? `Found ${books.length} book(s)`
            : "No books found matching your search criteria",
        data: books,
    });
}));
const getSingleBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        const book = yield book_service_1.BookServices.getBookByIdFromDB(id);
        if (!book) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Book not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server error",
                error: err.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Unknown server error",
            });
        }
    }
});
const deleteBook = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("this is id", id);
    try {
        const result = yield book_service_1.BookServices.deleteBookInDB(id);
        if (!result) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Book not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Book deleted successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error deleting book",
                error: error.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error deleting book",
                error: "An unexpected error occurred.",
            });
        }
    }
}));
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, author, description, isbn, coverImage, publishedDate, genre, pages } = req.body;
    console.log("Updating book:", id, req.body);
    try {
        // Validate required fields
        if (!id) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Book ID is required"
            });
        }
        // Use the service to update the book
        const updatedBook = yield book_service_1.BookServices.updateBook(id, {
            title,
            author,
            description,
            isbn,
            coverImage,
            publishedDate: publishedDate ? new Date(publishedDate) : undefined,
            genre,
            pages,
        });
        // If no book is found, return an error
        if (!updatedBook) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Book not found"
            });
        }
        // Respond with success and the updated book
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        });
    }
    catch (error) {
        console.error("Error updating book:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
exports.BookController = {
    createBook,
    getAllBooks,
    searchBooks,
    getSingleBook,
    deleteBook,
    updateBook,
};
