import { Request, Response, NextFunction } from "express";
import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { GenreServices } from "./genre.service";
import { Genre } from "./genre.interface";

const createGenre = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    
      console.log("   ⚠️using default userId:", req.user);
 

    const genreData: Genre = {
      name,
      description,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(genreData);

    const result = await GenreServices.createGenre(genreData as any);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Genre created successfully",
      data: result,
    });
  }
);

const getAllGenres = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await GenreServices.getAllGenresFromDB();

    if (!result || result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No genres found",
        data: [],
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Genres retrieved successfully",
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

const getSingleGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const genre = await GenreServices.getGenreByIdFromDB(id);

    if (!genre) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Genre not found",
        data: null,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Genre retrieved successfully",
      data: genre,
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

const updateGenre = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  console.log("Updating genre:", id, req.body);
  
  try {
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false,
        message: "Genre ID is required" 
      });
    }

    const updatedGenre = await GenreServices.updateGenre(id, {
      name,
      description,
    });

    if (!updatedGenre) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false,
        message: "Genre not found" 
      });
    }

    return res.status(StatusCodes.OK).json({ 
      success: true,
      message: "Genre updated successfully", 
      data: updatedGenre 
    });
  } catch (error) {
    console.error("Error updating genre:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

const deleteGenre = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log("this is id", id);
    try {
      const result = await GenreServices.deleteGenreInDB(id);
      if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "Genre not found",
          data: null,
        });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Genre deleted successfully",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting genre",
          error: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting genre",
          error: "An unexpected error occurred.",
        });
      }
    }
  }
);

export const GenreController = {
  createGenre,
  getAllGenres,
  getSingleGenre,
  updateGenre,
  deleteGenre,
};
