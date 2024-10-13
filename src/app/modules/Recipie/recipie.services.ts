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
    // Find the recipe associated with the given email
    const recipe = await RecipeModel.findOne({
      email: email,
      isDeleted: false,
    });

    // Return the recipe if found, otherwise null
    return recipe;
  } catch (error) {
    // Handle or log the error as needed
    throw new Error("Error fetching recipe by email: " + error.message);
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

  // Find the user by id to get the current value of isBlock

  // const recipe = await RecipeModel.find({ isDeleted: false }).populate("user");
  const recipe = await RecipeModel.findById(id);

  // Toggle the isBlock field to the opposite of its current value
  const result = await RecipeModel.findOneAndUpdate(
    { _id: id }, // Find the recipe by _id
    {
      isPublished: !recipe.isPublished, // Toggle the isPublished status
    },
    { new: true } // Return the updated document
  );

  if (!result) {
    throw new Error("Failed to update user");
  }

  console.log(result);
  return result;
};

const updateRecipe = async (id, updatedData) => {
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
