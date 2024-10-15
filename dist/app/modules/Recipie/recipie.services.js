"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipieServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recipie_model_1 = __importDefault(require("./recipie.model"));
const createRecipe = (recipie) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newUser = yield recipie_model_1.default.create([recipie], { session });
        yield session.commitTransaction();
        session.endSession();
        return newUser;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getAllRecipiesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // const io = await UserRegModel.findOne({ _id: "6675cac287245387ae84f79e" });
    // console.log("this is ", io);
    const result = yield recipie_model_1.default.find({ isDeleted: false }).populate("user");
    // const filteredResult = result.filter(booking => booking.facility !== null);
    // if (!filteredResult ) {
    //   throw new Error("No data found");
    // }
    return result;
});
const getRecipeByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recipie_model_1.default.findOne({ _id: id, isDeleted: false })
        .populate("user") // Populates the user who created the recipe
        .populate("comments.userId"); // Populates the user who commented
    return result;
});
const getRecipeByEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all recipes where the user has the given email and the recipe is not deleted
        const recipes = yield recipie_model_1.default.find({
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
    }
    catch (error) {
        throw new Error("Error fetching recipes by email: " + error.message);
    }
});
const deleteRecipeInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //const result1 = await FacilityModel.findOne(_id: id)
    // console.log('this is data',result1)
    const result = yield recipie_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    // if (!result) {
    //   throw new Error("No data Found");
    // }
    return result;
});
const updateReciceStatusInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    // Find the recipe by id
    const recipe = yield recipie_model_1.default.findById(id);
    // Check if the recipe exists
    if (!recipe) {
        throw new Error("Recipe not found");
    }
    // Toggle the isPublished status
    const result = yield recipie_model_1.default.findOneAndUpdate({ _id: id }, // Find the recipe by _id
    {
        isPublished: !recipe.isPublished, // Toggle the isPublished status
    }, { new: true } // Return the updated document
    );
    if (!result) {
        throw new Error("Failed to update recipe");
    }
    console.log(result);
    return result;
});
const updateRecipe = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the recipe by ID
        const recipe = yield recipie_model_1.default.findById(id);
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
        const updatedRecipe = yield recipe.save();
        // Return the updated recipe
        return updatedRecipe;
    }
    catch (error) {
        console.error("Error updating recipe:", error);
        throw error;
    }
});
exports.RecipieServices = {
    createRecipe,
    getAllRecipiesFromDB,
    getRecipeByIdFromDB,
    getRecipeByEmailFromDB,
    deleteRecipeInDB,
    updateReciceStatusInDB,
    updateRecipe,
};
