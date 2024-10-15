import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { RecipieServices } from "./recipie.services";
// import FacilityModel from "./facility.model";
// import { facilityValidationSchema } from "./facility.validation";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import RecipeModel from "./recipie.model";
import { ObjectId } from "mongodb";
import { Rating } from "./recipie.interface"; // If 'interfaces' is one level up

// interface Rating {
//   userId: string; // ব্যবহারকারীর আইডি
//   rating: number; // রেটিং সংখ্যা
//   recipeId: string; // রেসিপির আইডি
// }
interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}
interface Comment {
  _id?: string;
  userId: User;
  comment: string;
}

const createRecipie = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, time, image, recipe, user, rating } = req.body;

    interface Recipe {
      title: string; // Title of the recipe
      time: string; // Time required to prepare the recipe
      image: string; // URL of the recipe image
      recipe: string; // Detailed instructions of the recipe
      user: string; // ID of the user who created the recipe
      rating: number; // Rating of the recipe
      isPublished: boolean; // Whether the recipe is published
      isDeleted: boolean; // Whether the recipe is deleted
      createdAt: Date; // Date the recipe was created
      updatedAt: Date; // Date the recipe was last updated
      likedBy: string[]; // List of user IDs who liked the recipe
      dislikedBy: string[]; // List of user IDs who disliked the recipe
    }

    const recipieData: Recipe = {
      // Or however you're generating IDs
      title,
      time,
      image,
      recipe,
      user,
      rating,
      isPublished: true,
      isDeleted: false,
      createdAt: new Date(), // Set to the current date
      updatedAt: new Date(), // Set to the current date
      likedBy: [], // Initialize as an empty array
      dislikedBy: [], // Initialize as an empty array
    };

    console.log(recipieData);
    // এখানে মন্তব্য করা যাচাইয়ের অংশ যোগ করুন (যদি প্রয়োজন হয়)

    const result = await RecipieServices.createRecipe(recipieData as any);
    console.log(result);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Recipe created successfully", // এখানে সঠিক মেসেজ ব্যবহার করুন
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
    const { email } = req.params; // Get the user's email from request query
    console.log(email);
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

    // Ensure that the comments array is initialized
    if (!recipe.comments) {
      recipe.comments = []; // Initialize comments if it is undefined
    }

    // Create a new comment object
    const newComment = {
      userId, // ID of the user commenting
      comment, // Comment text
      // Optional rating (if applicable, you can include this based on your design)
      // rating: rating || null, // Uncomment if you have a rating field
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
    console.error("Error adding comment:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

const postRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recipeId, rating, userId } = req.body;

    // Find the recipe by ID
    const recipe = await RecipeModel.findById(recipeId);

    // Check if the recipe exists
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Ensure ratings is initialized
    if (!recipe.ratings) {
      recipe.ratings = []; // If ratings is undefined, initialize as an empty array
    }

    // Check if the user has already rated the recipe
    const existingRating = recipe.ratings.find(
      (r: Rating) => r.userId.toString() === userId
    );

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
    } else {
      // Add a new rating
      recipe.ratings.push({ userId, rating });
    }

    // Recalculate the average rating
    const totalRatings = recipe.ratings.length;
    const sumOfRatings = recipe.ratings.reduce(
      (sum: number, r: Rating) => sum + (r.rating || 0), // Handle possible undefined rating
      0
    );

    const averageRating = totalRatings ? sumOfRatings / totalRatings : 0; // Avoid division by zero

    // Update the recipe's average rating
    recipe.rating = averageRating;

    // Save the updated recipe
    await recipe.save();

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      rating: recipe.rating,
    });
  } catch (error) {
    next(error);
  }
};

const updateRecipeController = async (req: Request, res: Response) => {
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

const likeRecipe = async (req: Request, res: Response) => {
  const { recipeId, userId } = req.body;

  console.log("Recipe ID:", recipeId, "User ID:", userId);

  try {
    const recipe = await RecipeModel.findById(recipeId);
    console.log(recipe);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already liked the recipe
    if (recipe.likedBy.includes(userId)) {
      // If the user has already liked the recipe, remove them from likedBy using filter
      recipe.likedBy = recipe.likedBy.filter((id) => id !== userId);
      console.log("User unliked the recipe:", recipeId);
    } else {
      // If the user has disliked the recipe, remove them from dislikedBy using filter
      if (recipe.dislikedBy.includes(userId)) {
        recipe.dislikedBy = recipe.dislikedBy.filter((id) => id !== userId);
      }

      // Add the user to likedBy
      recipe.likedBy.push(userId);
      console.log("User liked the recipe:", recipeId);
    }

    // Save the updated recipe
    await recipe.save();

    return res
      .status(200)
      .json({ message: "Recipe liked/unliked successfully", data: recipe });
  } catch (error) {
    // Type assertion to ensure error is of type Error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(error);
    return res.status(500).json({
      message: `Error disliking/undisliking recipe: ${errorMessage}`,
    });
  }
};

const dislikeRecipe = async (req: Request, res: Response) => {
  const { recipeId, userId } = req.body;

  console.log("Recipe ID:", recipeId, "User ID:", userId);

  try {
    const recipe = await RecipeModel.findById(recipeId);
    console.log(recipe);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already disliked the recipe
    if (recipe.dislikedBy.includes(userId)) {
      // If the user has already disliked the recipe, remove them from dislikedBy using filter
      recipe.dislikedBy = recipe.dislikedBy.filter((id) => id !== userId);
      console.log("User removed dislike from the recipe:", recipeId);
    } else {
      // If the user has liked the recipe, remove them from likedBy using filter
      if (recipe.likedBy.includes(userId)) {
        recipe.likedBy = recipe.likedBy.filter((id) => id !== userId);
      }

      // Add the user to dislikedBy
      recipe.dislikedBy.push(userId);
      console.log("User disliked the recipe:", recipeId);
    }

    // Save the updated recipe
    await recipe.save();

    return res.status(200).json({
      message: "Recipe disliked/undisliked successfully",
      data: recipe,
    });
  } catch (error) {
    // Type assertion to ensure error is of type Error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(error);
    return res.status(500).json({
      message: `Error disliking/undisliking recipe: ${errorMessage}`,
    });
  }
};

// Delete a comment
const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  // Assuming you have the userId available in req.user (from JWT token)

  try {
    // Find the recipe containing the comment by its ID
    const recipeId = req.body.recipeId; // You need to pass the recipe ID in the request body
    const recipe = await RecipeModel.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Ensure comments is initialized to an empty array if undefined
    recipe.comments = recipe.comments || [];

    // Remove the comment from the recipe
    recipe.comments = recipe.comments.filter((comment: any) => {
      return comment._id?.toString() !== commentId; // Ensure we are comparing as strings
    });

    // Save the updated recipe
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
