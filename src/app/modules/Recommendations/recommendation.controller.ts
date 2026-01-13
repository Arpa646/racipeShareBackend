import { Request, Response, NextFunction } from "express";
import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { RecommendationServices } from "./recommendation.service";

/**
 * Get personalized book recommendations for the authenticated user
 * GET /api/recommendations
 */
const getRecommendations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

    const result = await RecommendationServices.getPersonalizedRecommendations(userId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: result.fallbackUsed
        ? "Popular book recommendations (limited reading history)"
        : "Personalized recommendations retrieved successfully",
      data: result,
    });
  }
);

export const RecommendationController = {
  getRecommendations,
};
