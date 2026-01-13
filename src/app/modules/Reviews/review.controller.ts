import { Request, Response, NextFunction } from "express";
import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { ReviewServices } from "./review.service";
import { Review } from "./review.interface";
import mongoose from "mongoose";
import { UserRegModel } from "../Registration/user.model";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookId, rating, comment } = req.body;

    // Get userId from token (req.user.useremail contains the ObjectId)
    const DEFAULT_USER_ID = "673a0ad83e3e75c0f3804dab";
    let userId: string;
    
    if (req.user?.useremail) {
      // useremail in token contains the user ObjectId
      userId = req.user.useremail.toString();
      console.log("   ✅ User ID from token:", userId);
      console.log("   📋 Token payload:", JSON.stringify(req.user, null, 2));
    } else {
      // Fall back to default if token not present
      userId = DEFAULT_USER_ID;
      console.log("   ⚠️  No token found, using default userId:", userId);
      console.log("   ⚠️  req.user:", JSON.stringify(req.user, null, 2));
    }

    console.log("📝 Review Submission Received:");
    console.log("   User ID:", userId);
    console.log("   Book ID:", bookId);
    console.log("   Rating:", rating);
    console.log("   Comment:", comment || "No comment provided");

    // Validate rating
    if (rating < 1 || rating > 5) {
      console.log("❌ Invalid rating:", rating, "- Must be between 1 and 5");
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const reviewData: Review = {
      userId,
      bookId,
      rating,
      comment,
      status: "pending",
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("💾 Creating review in database...");
    const result = await ReviewServices.createReview(reviewData as any);
    console.log("✅ Review created successfully!");
    console.log("   Review ID:", result[0]?._id || "N/A");
    console.log("   Status: pending (awaiting approval)");

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let result;
    if (status === "pending" || status === "approved") {
      result = await ReviewServices.getReviewsByStatus(status as "pending" | "approved");
    } else {
      result = await ReviewServices.getAllReviewsFromDB();
    }

    if (!result || result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No reviews found",
        data: [],
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Reviews retrieved successfully",
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

const getSingleReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await ReviewServices.getReviewByIdFromDB(id);

    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Review not found",
        data: null,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
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

const getReviewsByBook = catchAsync(async (req: Request, res: Response) => {
  const { bookId } = req.params;
  
  console.log("📚 Getting reviews for book ID:", bookId);
  
  if (!bookId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Book ID is required",
    });
  }

  const reviews = await ReviewServices.getReviewsByBookId(bookId);

  console.log(`✅ Found ${reviews.length} approved reviews for book ${bookId}`);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: reviews.length > 0 
      ? "Reviews retrieved successfully" 
      : "No approved reviews found for this book",
    data: reviews,
  });
});

const getReviewsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const reviews = await ReviewServices.getReviewsByUserId(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
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

const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment, status } = req.body;
  
  console.log("🔄 Review Update Request:");
  console.log("   Review ID:", id);
  console.log("   Updates:", { rating, comment, status });
  
  try {
    if (!id) {
      console.log("❌ Review ID is missing");
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false,
        message: "Review ID is required" 
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      console.log("❌ Invalid rating:", rating);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const updatedReview = await ReviewServices.updateReview(id, {
      rating,
      comment,
      status,
    });

    if (!updatedReview) {
      console.log("❌ Review not found with ID:", id);
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false,
        message: "Review not found" 
      });
    }

    console.log("✅ Review updated successfully!");
    console.log("   Review ID:", updatedReview._id);
    if (status) console.log("   New Status:", status);

    return res.status(StatusCodes.OK).json({ 
      success: true,
      message: "Review updated successfully", 
      data: updatedReview 
    });
  } catch (error) {
    console.error("❌ Error updating review:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const result = await ReviewServices.deleteReviewInDB(id);
      if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "Review not found",
          data: null,
        });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Review deleted successfully",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting review",
          error: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error deleting review",
          error: "An unexpected error occurred.",
        });
      }
    }
  }
);

const approveReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    console.log("✅ Admin approving review:", id);
    
    try {
      const review = await ReviewServices.getReviewByIdFromDB(id);
      
      if (!review) {
        console.log("❌ Review not found:", id);
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Review not found",
          data: null,
        });
      }

      if (review.status === "approved") {
        console.log("⚠️  Review already approved:", id);
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Review is already approved",
          data: review,
        });
      }

      const updatedReview = await ReviewServices.updateReview(id, {
        status: "approved",
      });

      console.log("✅ Review approved successfully:", updatedReview?._id);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review approved successfully",
        data: updatedReview,
      });
    } catch (error: unknown) {
      console.error("❌ Error approving review:", error);
      if (error instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error approving review",
          error: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Error approving review",
          error: "An unexpected error occurred.",
        });
      }
    }
  }
);

export const ReviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
  getReviewsByBook,
  getReviewsByUser,
  updateReview,
  deleteReview,
  approveReview,
};
