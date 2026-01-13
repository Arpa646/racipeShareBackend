import { Request, Response, NextFunction } from "express";
import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { ShelfServices } from "./shelf.service";
import { Shelf } from "./shelf.interface";

const createShelf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId, status, progress } = req.body;

    // Get userId from token (req.user.useremail contains the ObjectId)
    if (!req.user?.useremail) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    const userId = req.user.useremail.toString();

    // Check if shelf entry already exists
    const existingShelf = await ShelfServices.getShelfByUserAndBook(userId, bookId);
    if (existingShelf) {
      // Update existing entry
      const updatedShelf = await ShelfServices.updateShelf(existingShelf._id as string, {
        status,
        progress,
      });
      return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Shelf updated successfully",
        data: updatedShelf,
      });
    }

    const shelfData: Shelf = {
      userId,
      bookId,
      status,
      progress: progress || 0,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ShelfServices.createShelf(shelfData as any);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Book added to shelf successfully",
      data: result,
    });
  }
);

const getAllShelves = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await ShelfServices.getAllShelvesFromDB();

    if (!result || result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No shelf entries found",
        data: [],
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Shelf entries retrieved successfully",
      data: result,
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
});

const getSingleShelf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shelf = await ShelfServices.getShelfByIdFromDB(id);

    if (!shelf) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Shelf entry not found",
        data: null,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Shelf entry retrieved successfully",
      data: shelf,
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

const getShelvesByUser = async (req: Request, res: Response) => {
  try {
    // Get userId from token (req.user.useremail contains the ObjectId)
    if (!req.user?.useremail) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    const userId = req.user.useremail.toString();
    const shelves = await ShelfServices.getShelvesByUserId(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User shelf retrieved successfully",
      data: shelves,
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

const getShelvesByBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const shelves = await ShelfServices.getShelvesByBookId(bookId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Book shelf entries retrieved successfully",
      data: shelves,
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

const updateShelf = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, progress } = req.body;
  
  try {
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false,
        message: "Shelf ID is required" 
      });
    }

    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    const updatedShelf = await ShelfServices.updateShelf(id, {
      status,
      progress,
    });

    if (!updatedShelf) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false,
        message: "Shelf entry not found" 
      });
    }

    return res.status(StatusCodes.OK).json({ 
      success: true,
      message: "Shelf updated successfully", 
      data: updatedShelf 
    });
  } catch (error) {
    console.error("Error updating shelf:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

const deleteShelf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result = await ShelfServices.deleteShelfInDB(id);
      if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "Shelf entry not found",
          data: null,
        });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Book removed from shelf successfully",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting shelf entry",
          error: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting shelf entry",
          error: "An unexpected error occurred.",
        });
      }
    }
  }
);

export const ShelfController = {
  createShelf,
  getAllShelves,
  getSingleShelf,
  getShelvesByUser,
  getShelvesByBook,
  updateShelf,
  deleteShelf,
};
