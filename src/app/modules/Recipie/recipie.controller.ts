import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { RecipieServices } from "./recipie.services";
// import FacilityModel from "./facility.model";
// import { facilityValidationSchema } from "./facility.validation";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import RecipeModel from "./recipie.model";
const createRecipie = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, time, image, recipe, user, rating } = req.body;

    const recipieData = {
      title,
      time,
      image, // Optional, may not exist
      recipe,
      user, // Should be a valid user ObjectId
      rating,
      comment: [],
      isPublish: true,
      isDelete: false,
    };
    console.log(recipieData);
    //  const validationResult = facilityValidationSchema.safeParse(facilityData);
    // console.log(validationResult);
    // if (!validationResult.success) {
    //   // Collect validation errors
    //   const validationErrors = validationResult.error.errors.map(
    //     (error: any) => ({
    //       path: Array.isArray(error.path) ? error.path.join(".") : error.path,
    //       message: error.message,
    //     })
    //   );

    //   // Return validation errors as JSON response
    //   return res.status(400).json({
    //     success: false,
    //     errors: validationErrors,
    //   });
    // }

    const result = await RecipieServices.createRecipe(recipieData);
    console.log(result);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "facility created  succesfully",
      data: result,
    });
  }
);

const getAllRacipie = catchAsync(async (req: Request, res: Response) => {
  // sendResponse(res, {
  //   statusCode: StatusCodes.OK,
  //   success: true,
  //   message: "Bookings retrieved successfully",
  //   data: result,
  // });
  try {
    const result = await RecipieServices.getAllRecipiesFromDB();

    if (!result || result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No Recipie found",
        data: [],
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Facility retrieved successfully",
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
const getSingleRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get the facility ID from request params
    console.log(id);
    const recipe = await RecipieServices.getRecipeByIdFromDB(id);

    if (!recipe) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "recipie not found",
        data: {},
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Facility retrieved successfully",
      data: recipe,
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
const getSingleRecipeByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.query; // Get the user's email from request query

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log(email); // Debugging: Ensure you're receiving the correct email

    // Fetch the recipe based on the provided email
    const facility = await RecipieServices.getRecipeByEmailFromDB(
      email as string
    );

    if (!facility) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Recipe not found",
        data: null,
      });
    }

    // Return success response with the facility data
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Recipe retrieved successfully",
      data: facility,
    });
  } catch (err) {
    if (err instanceof Error) {
      // If error is instance of Error, send server error response
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    } else {
      // Handle unknown server errors
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unknown server error",
      });
    }
  }
};

const deleteRecipe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log("this is id", id);
    try {
      const result = await RecipieServices.deleteRecipeInDB(id);
      if (!result) {
        return res.status(404).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "No Data Found",
          data: [],
        });
      }
      res.status(200).json({
        success: true,
        message: "Recipe deleted successfully",
        data: result,
      });
    } catch (error: unknown) {
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Error deleting facility",
          error: error.message,
        });
      } else {
        // Handle unexpected error types
        res.status(500).json({
          success: false,
          message: "Error deleting facility",
          error: "An unexpected error occurred.",
        });
      }
    }
  }
);

const updateRecipieStates = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(id);
    const updateData = req.body;
    const result = await RecipieServices.updateReciceStatusInDB(id);
    console.log("up", result);
    if (!result) {
      return res.status(404).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "No Data Found",
        data: [],
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Facility updated successfully",
      data: result,
    });
  }
);

const addComment = async (req: Request, res: Response) => {
  try {
    const { recipeId, userId, comment } = req.body;
    console.log(recipeId, userId, comment);
    // Find the recipe by ID
    const recipe = await RecipeModel.findById(recipeId);
    console.log(recipe);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Create a new comment object
    const newComment = {
      userId, // ID of the user commenting
      // Username or user's name
      comment, // Comment text
      // Optional rating (1 to 5)
    };

    // Add the new comment to the comments array of the recipe
    recipe.comments.push(newComment);

    // Save the updated recipe document
    await recipe.save();

    res.status(201).json({
      message: "Comment added successfully",
      comments: recipe.comments, // Return updated comments
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const postRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recipeId, rating, userId } = req.body; // Expecting recipeId, rating, and userId

    // Find the recipe by ID
    const recipe = await RecipeModel.findById(recipeId);

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Check if the user has already rated the recipe
    const existingRating = recipe.ratings.find((r) => {
      console.log("r.userId:", r.userId.toString()); // Convert ObjectId to string for clarity
      console.log("userId:", userId); // Assuming userId is already a string
      return r.userId.toString() === userId; // Convert r.userId to string for comparison
    });

    if (existingRating) {
      // Update the existing rating if user has already rated
      console.log("yes duplicatite");
      existingRating.rating = rating;
    } else {
      console.log("no duplicatite");
      // Add a new rating and userId if no previous rating found
      recipe.ratings.push({ userId, rating });
    }

    // Recalculate the average rating
    const totalRatings = recipe.ratings.length;
    const sumOfRatings = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumOfRatings / totalRatings;

    // Update the recipe's average rating
    recipe.rating = averageRating;

    // Save the updated recipe
    await recipe.save();

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      rating: recipe.rating, // Send back the updated average rating
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};

const updateRecipeController = async (req, res) => {
  const { id } = req.params; // Recipe ID from URL params
  const { title, time, image, recipe } = req.body; // Recipe data from the request body
  console.log("hiii", id, title, time, image, recipe);
  try {
    // Validate required fields
    if (!id || !title || !time || !image || !recipe) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Use the service to update the recipe
    const updatedRecipe = await RecipieServices.updateRecipe(id, {
      title,
      time,
      image,
      recipe,
    });

    // If no recipe is found, return an error
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Respond with success and the updated recipe
    return res
      .status(200)
      .json({ message: "Recipe updated successfully", data: updatedRecipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const likeRecipe = async (req, res) => {
  // Destructure recipeId and userId from req.body
  const { recipeId, userId } = req.body;

  console.log("Recipe ID:", recipeId, "User ID:", userId);

  try {
    // Find the recipe by its ID
    const recipe = await RecipeModel.findById(recipeId);
    console.log(recipe); // Logging the recipe to check its details

    if (!recipe) {
      // If no recipe is found, return a 404 error
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already liked the recipe
    if (recipe.likedBy.includes(userId)) {
      // If the user has already liked the recipe, remove them from likedBy
      recipe.likedBy.pull(userId); // Remove the user from likedBy
      console.log("User unliked the recipe:", recipeId);
    } else {
      // If the user has disliked the recipe, remove them from dislikedBy
      if (recipe.dislikedBy.includes(userId)) {
        recipe.dislikedBy.pull(userId); // Remove the user from dislikedBy
      }

      // Add the user to likedBy
      recipe.likedBy.push(userId);
      console.log("User liked the recipe:", recipeId);
    }

    // Save the updated recipe
    await recipe.save();

    // Return a success message
    return res
      .status(200)
      .json({ message: "Recipe liked/unliked successfully", data: recipe });
  } catch (error) {
    // Log the error and return an appropriate message
    console.error(error);
    return res
      .status(500)
      .json({ message: `Error liking/unliking recipe: ${error.message}` });
  }
};

const dislikeRecipe = async (req, res) => {
  // Destructure recipeId and userId from req.body
  const { recipeId, userId } = req.body;

  console.log("Recipe ID:", recipeId, "User ID:", userId);

  try {
    // Find the recipe by its ID
    const recipe = await RecipeModel.findById(recipeId);
    console.log(recipe); // Logging the recipe to check its details

    if (!recipe) {
      // If no recipe is found, return a 404 error
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already disliked the recipe
    if (recipe.dislikedBy.includes(userId)) {
      // If the user has already disliked the recipe, remove them from dislikedBy
      recipe.dislikedBy.pull(userId); // Remove the user from dislikedBy
      console.log("User removed dislike from the recipe:", recipeId);
    } else {
      // If the user has liked the recipe, remove them from likedBy
      if (recipe.likedBy.includes(userId)) {
        recipe.likedBy.pull(userId); // Remove the user from likedBy
      }

      // Add the user to dislikedBy
      recipe.dislikedBy.push(userId);
      console.log("User disliked the recipe:", recipeId);
    }

    // Save the updated recipe
    await recipe.save();

    // Return a success message
    return res
      .status(200)
      .json({
        message: "Recipe disliked/undisliked successfully",
        data: recipe,
      });
  } catch (error) {
    // Log the error and return an appropriate message
    console.error(error);
    return res
      .status(500)
      .json({
        message: `Error disliking/undisliking recipe: ${error.message}`,
      });
  }
};

// Delete a comment
const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
// Assuming you have the userId available in req.user (from JWT token)

  try {
    // Find the recipe containing the comment
    const recipe = await RecipeModel.findOne();

    if (!recipe) {
      return res
        .status(404)
        .json({ message: "Comment not found or not authorized" });
    }

    // Remove the comment from the recipe
    recipe.comments = recipe.comments.filter((comment) => {
      console.log("Comment ID from DB:", comment._id.toString());
      console.log("Comment ID from request:", commentId);
      return comment._id.toString() !== commentId;
    });
    await recipe.save();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const RecipieController = {
  createRecipie,
  getAllRacipie,
  getSingleRecipe,
  getSingleRecipeByEmail,
  deleteRecipe,
  updateRecipieStates,
  addComment,
  postRating,
  updateRecipeController,
  likeRecipe,
  dislikeRecipe,
  deleteComment,
};
