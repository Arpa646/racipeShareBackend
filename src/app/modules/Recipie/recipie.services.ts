import { startSession, Mongoose } from "mongoose";
import mongoose from "mongoose";
// import { IUser } from "./user.interface";
//import { UserRegModel } from "./user.model";
import { Recipe } from "./recipie.interface";
import RecipeModel from "./recipie.model";

const createRecipe = async (recipie: Recipe) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newUser = await RecipeModel.create([recipie], { session });
    await session.commitTransaction();
    session.endSession();
    return newUser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getAllRecipiesFromDB = async () => {
  // const io = await UserRegModel.findOne({ _id: "6675cac287245387ae84f79e" });

  // console.log("this is ", io);

  const result = await RecipeModel.find({ isDeleted: false }).populate("user");

  // const filteredResult = result.filter(booking => booking.facility !== null);

  // if (!filteredResult ) {
  //   throw new Error("No data found");
  // }

  return result;
};

const getRecipeByIdFromDB = async (id: string) => {
  const result = await RecipeModel.findOne({ _id: id, isDeleted: false })
    .populate("user") // Populates the user who created the recipe
    .populate("comments.userId"); // Populates the user who commented

  return result;
};

const getRecipeByEmailFromDB = async (email: string) => {
  try {
    // Find all recipes where the user has the given email and the recipe is not deleted
    const recipes = await RecipeModel.find({
      isDeleted: false,
    }).populate({
      path: "user",
      match: { email: email }, // Matching user by email
    });

    // Filter out any recipes that didn't match the user by email (if user population fails)
    const filteredRecipes = recipes.filter((recipe) => recipe.user);

    // If no recipes are found, return an empty array
    if (filteredRecipes.length === 0) {
      return null;
    }

    return filteredRecipes; // Return all matching recipes with populated user details
  } catch (error: unknown) {
    throw new Error(
      "Error fetching recipes by email: " + (error as Error).message
    );
  }
};

const deleteRecipeInDB = async (id: string) => {
  //const result1 = await FacilityModel.findOne(_id: id)
  // console.log('this is data',result1)
  const result = await RecipeModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  // if (!result) {
  //   throw new Error("No data Found");
  // }

  return result;
};

const updateReciceStatusInDB = async (id: string) => {
  console.log(id);

  // Find the recipe by id
  const recipe = await RecipeModel.findById(id);

  // Check if the recipe exists
  if (!recipe) {
    throw new Error("Recipe not found");
  }

  // Toggle the isPublished status
  const result = await RecipeModel.findOneAndUpdate(
    { _id: id }, // Find the recipe by _id
    {
      isPublished: !recipe.isPublished, // Toggle the isPublished status
    },
    { new: true } // Return the updated document
  );

  if (!result) {
    throw new Error("Failed to update recipe");
  }

  console.log(result);
  return result;
};

interface UpdateRecipeData {
  title?: string;
  time?: string; // or number, depending on how you represent time
  image?: string; // URL or path to the image
  recipe?: string; // Detailed recipe instructions
}
const updateRecipe = async (id: string, updatedData: UpdateRecipeData) => {
  try {
    // Find the recipe by ID
    const recipe = await RecipeModel.findById(id);

    // If recipe doesn't exist, return null
    if (!recipe) {
      return null;
    }

    // Update recipe fields
    recipe.title = updatedData.title || recipe.title;
    recipe.time = updatedData.time || recipe.time;
    recipe.image = updatedData.image || recipe.image;
    recipe.recipe = updatedData.recipe || recipe.recipe;

    // Save the updated recipe
    const updatedRecipe = await recipe.save();

    // Return the updated recipe
    return updatedRecipe;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

export const RecipieServices = {
  createRecipe,
  getAllRecipiesFromDB,
  getRecipeByIdFromDB,
  getRecipeByEmailFromDB,
  deleteRecipeInDB,
  updateReciceStatusInDB,
  updateRecipe,
};
