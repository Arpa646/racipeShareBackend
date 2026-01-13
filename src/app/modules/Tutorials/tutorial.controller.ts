import { Request, Response, NextFunction } from "express";
import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { TutorialServices } from "./tutorial.service";
import { Tutorial } from "./tutorial.interface";

const createTutorial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, youtubeUrl, category } = req.body;

    const tutorialData: Tutorial = {
      title,
      youtubeUrl,
      category,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await TutorialServices.createTutorial(tutorialData as any);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Tutorial created successfully",
      data: result,
    });
  }
);

const getAllTutorials = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await TutorialServices.getAllTutorialsFromDB();

    if (!result || result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No tutorials found",
        data: [],
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tutorials retrieved successfully",
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

const getSingleTutorial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tutorial = await TutorialServices.getTutorialByIdFromDB(id);

    if (!tutorial) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Tutorial not found",
        data: null,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tutorial retrieved successfully",
      data: tutorial,
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

const updateTutorial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, youtubeUrl, category } = req.body;
  
  try {
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false,
        message: "Tutorial ID is required" 
      });
    }

    const updatedTutorial = await TutorialServices.updateTutorial(id, {
      title,
      youtubeUrl,
      category,
    });

    if (!updatedTutorial) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false,
        message: "Tutorial not found" 
      });
    }

    return res.status(StatusCodes.OK).json({ 
      success: true,
      message: "Tutorial updated successfully", 
      data: updatedTutorial 
    });
  } catch (error) {
    console.error("Error updating tutorial:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

const deleteTutorial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result = await TutorialServices.deleteTutorialInDB(id);
      if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "Tutorial not found",
          data: null,
        });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Tutorial deleted successfully",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting tutorial",
          error: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting tutorial",
          error: "An unexpected error occurred.",
        });
      }
    }
  }
);

export const TutorialController = {
  createTutorial,
  getAllTutorials,
  getSingleTutorial,
  updateTutorial,
  deleteTutorial,
};
