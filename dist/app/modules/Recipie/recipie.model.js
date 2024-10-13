"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema for the Booking model
const recipeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Optional image
    },
    recipe: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: true,
    },
    comments: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" }, // Referencing the user ID from User model
            // Name or username of the commenter
            comment: { type: String, required: true }, // The actual comment
            // Optional rating, limited to 1-5 stars
            // Date of the comment
        },
    ], // Optional comments array
    isDeleted: {
        type: Boolean,
        default: false, // Default value is false indicating the record is not deleted
    },
    likedBy: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User", // Array of user IDs who liked the recipe
        }],
    dislikedBy: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User", // Array of user IDs who disliked the recipe
        }],
    isPublished: {
        type: Boolean,
        default: true, // Default value is false indicating the record is not deleted
    },
    ratings: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, required: true, min: 1, max: 5 },
        },
    ],
    rating: {
        type: Number, // Optional recipe rating
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
// Create the Booking model using the schema
const RecipeModel = mongoose_1.default.model("recipie", recipeSchema);
exports.default = RecipeModel;
