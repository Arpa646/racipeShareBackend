import { Request, Response, NextFunction } from "express";
import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { BookServices } from "./book.service";
import { Book } from "./book.interface";

const createBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const { title, author, description, isbn, coverImage, publishedDate, genre, pages } = req.body;

    // Get userId from token (req.user.useremail contains the ObjectId)
    const DEFAULT_USER_ID = "673a0ad83e3e75c0f3804dab";
    let userId: string;
    
    if (req.user?.useremail) {
      // useremail in token contains the user ObjectId
      userId = req.user.useremail.toString();
      console.log("✅ User ID from token:", userId);
    } else {
      // Fall back to default if token not present
      userId = DEFAULT_USER_ID;
      console.log("⚠️  No token found, using default userId:", userId);
    }

    const bookData: Book = {
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

    const result = await BookServices.createBook(bookData as any);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Book created successfully",
      data: result,
    });
  }
);

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.getAllBooksFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.length > 0 
      ? "Books retrieved successfully" 
      : "No books found",
    data: result,
  });
});

const searchBooks = catchAsync(async (req: Request, res: Response) => {
  const { title, author, genres, minRating, maxRating, sortBy } = req.query;

  const filters: any = {};
  
  if (title && typeof title === "string") filters.title = title;
  if (author && typeof author === "string") filters.author = author;
  // Handle genres - can be string (comma-separated) or array
  if (genres) {
    filters.genres = genres;
  }
  if (minRating) filters.minRating = parseFloat(minRating as string);
  if (maxRating) filters.maxRating = parseFloat(maxRating as string);
  if (sortBy && typeof sortBy === "string") {
    filters.sortBy = sortBy;
  }

  const books = await BookServices.searchBooks(filters);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: books.length > 0 
      ? `Found ${books.length} book(s)` 
      : "No books found matching your search criteria",
    data: books,
  });
});

const getSingleBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const book = await BookServices.getBookByIdFromDB(id);

    if (!book) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unknown server error",
      });
    }
  }
};

const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log("this is id", id);
    try {
      const result = await BookServices.deleteBookInDB(id);
      if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "Book not found",
          data: null,
        });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Book deleted successfully",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting book",
          error: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting book",
          error: "An unexpected error occurred.",
        });
      }
    }
  }
);

const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author, description, isbn, coverImage, publishedDate, genre, pages } = req.body;
  console.log("Updating book:", id, req.body);
  
  try {
    // Validate required fields
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false,
        message: "Book ID is required" 
      });
    }

    // Use the service to update the book
    const updatedBook = await BookServices.updateBook(id, {
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
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    // Respond with success and the updated book
    return res.status(StatusCodes.OK).json({ 
      success: true,
      message: "Book updated successfully", 
      data: updatedBook 
    });
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const BookController = {
  createBook,
  getAllBooks,
  searchBooks,
  getSingleBook,
  deleteBook,
  updateBook,
};
