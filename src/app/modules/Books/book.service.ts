import mongoose from "mongoose";
import { Book } from "./book.interface";
import BookModel from "./book.model";

const createBook = async (bookData: Book) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newBook = await BookModel.create([bookData], { session });
    await session.commitTransaction();
    session.endSession();
    return newBook;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getAllBooksFromDB = async () => {
  const result = await BookModel.find({ isDeleted: false })
    .populate("user")
    .populate("genre");
  return result;
};

const getBookByIdFromDB = async (id: string) => {
  const result = await BookModel.findOne({ _id: id, isDeleted: false })
    .populate("user")
    .populate("genre");
  return result;
};

const deleteBookInDB = async (id: string) => {
  const result = await BookModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};

interface UpdateBookData {
  title?: string;
  author?: string;
  description?: string;
  isbn?: string;
  coverImage?: string;
  publishedDate?: Date;
  genre?: string;
  pages?: number;
}

const updateBook = async (id: string, updatedData: UpdateBookData) => {
  try {
    const book = await BookModel.findById(id);

    if (!book) {
      return null;
    }

    // Update book fields
    if (updatedData.title !== undefined) book.title = updatedData.title;
    if (updatedData.author !== undefined) book.author = updatedData.author;
    if (updatedData.description !== undefined) book.description = updatedData.description;
    if (updatedData.isbn !== undefined) book.isbn = updatedData.isbn;
    if (updatedData.coverImage !== undefined) book.coverImage = updatedData.coverImage;
    if (updatedData.publishedDate !== undefined) book.publishedDate = updatedData.publishedDate;
    if (updatedData.genre !== undefined) book.genre = updatedData.genre;
    if (updatedData.pages !== undefined) book.pages = updatedData.pages;

    const updatedBook = await book.save();
    // Populate genre before returning
    await updatedBook.populate("genre");
    await updatedBook.populate("user");
    return updatedBook;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

interface SearchFilters {
  title?: string;
  author?: string;
  genres?: string | string[];
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
}

const searchBooks = async (filters: SearchFilters) => {
  try {
    const { title, author, genres, minRating, maxRating, sortBy = "createdAt" } = filters;

    // Build base query
    const query: any = {
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
      let genreArray: string[] = [];
      
      if (typeof genres === "string") {
        // Handle comma-separated string: "genreId1,genreId2,genreId3"
        genreArray = genres.split(",").map((g: string) => g.trim()).filter((g: string) => g.length > 0);
      } else if (Array.isArray(genres)) {
        // Handle array: ["genreId1", "genreId2", "genreId3"]
        genreArray = genres.map((g: any) => String(g).trim()).filter((g: string) => g.length > 0);
      }
      
      if (genreArray.length > 0) {
        // Convert to ObjectIds for querying
        const genreObjectIds = genreArray.map((id) => new mongoose.Types.ObjectId(id));
        // Use $in to match any of the genre IDs
        query.genre = { $in: genreObjectIds };
      }
    }

    // Get all books matching the filters
    let books = await BookModel.find(query)
      .populate("user", "name email")
      .populate("genre")
      .lean();

    // Calculate average ratings from reviews if rating filters are provided
    if (minRating !== undefined || maxRating !== undefined || sortBy === "rating") {
      const ReviewModel = mongoose.model("Review");
      
      // Get all book IDs
      const bookIds = books.map((book: any) => book._id);

      // Aggregate ratings from reviews
      const ratingAggregation = await ReviewModel.aggregate([
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
      books = books.map((book: any) => {
        const ratingData = ratingMap.get(book._id.toString());
        return {
          ...book,
          averageRating: ratingData?.averageRating || 0,
          totalRatings: ratingData?.totalRatings || 0,
        };
      });

      // Filter by rating range
      if (minRating !== undefined) {
        books = books.filter((book: any) => book.averageRating >= minRating);
      }
      if (maxRating !== undefined) {
        books = books.filter((book: any) => book.averageRating <= maxRating);
      }

      // Sort by rating if requested
      if (sortBy === "rating") {
        books.sort((a: any, b: any) => {
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
      books.sort((a: any, b: any) => {
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
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

export const BookServices = {
  createBook,
  getAllBooksFromDB,
  getBookByIdFromDB,
  deleteBookInDB,
  updateBook,
  searchBooks,
};
