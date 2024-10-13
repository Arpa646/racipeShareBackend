import  {recipie}  from './recipie.inteface';
import mongoose, { Schema, Document, Model } from "mongoose";

// Define the schema for the Booking model


const recipeSchema: Schema<recipie> = new Schema<recipie>({
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
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },

  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" }, // Referencing the user ID from User model
        // Name or username of the commenter
      comment: { type: String, required: true }, // The actual comment
     // Optional rating, limited to 1-5 stars
    // Date of the comment
    },
  ],// Optional comments array
 


  isDeleted: {
    type: Boolean,
    default: false, // Default value is false indicating the record is not deleted
  },


  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: "User", // Array of user IDs who liked the recipe
  }],
  dislikedBy: [{
    type: Schema.Types.ObjectId,
    ref: "User", // Array of user IDs who disliked the recipe
  }],




  isPublished: {
    type: Boolean,
    default: true, // Default value is false indicating the record is not deleted
  },
  ratings: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
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
const RecipeModel: Model<recipie> = mongoose.model<recipie>(
  "recipie",
  recipeSchema
);

export default RecipeModel;
