import mongoose from "mongoose";
import { Review } from "./review.interface";
import ReviewModel from "./review.model";

const createReview = async (reviewData: Review) => {
  const session = await mongoose.startSession();
console.log("reviewData", reviewData);
  try {
    session.startTransaction();
    console.log("   📊 Database: Starting transaction...");
    const newReview = await ReviewModel.create([reviewData], { session });
    await session.commitTransaction();
    session.endSession();
    console.log("   📊 Database: Review saved successfully");
    return newReview;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    console.error("   ❌ Database Error:", err.message);
    throw new Error(err);
  }
};

const getAllReviewsFromDB = async () => {
  const result = await ReviewModel.find({ isDeleted: false })
    .populate("userId", "name email")
    .populate("bookId", "title author")
    .sort({ createdAt: -1 });
  return result;
};

const getReviewByIdFromDB = async (id: string) => {
  const result = await ReviewModel.findOne({ _id: id, isDeleted: false })
    .populate("userId", "name email")
    .populate("bookId", "title author");
  return result;
};

const getReviewsByBookId = async (bookId: string) => {
  const result = await ReviewModel.find({ 
    bookId: new mongoose.Types.ObjectId(bookId), 
    isDeleted: false, 
    status: "approved" 
  })
    .populate("userId", "name email")
    .populate("bookId", "title author coverImage")
    .sort({ createdAt: -1 });
  return result;
};

const getReviewsByUserId = async (userId: string) => {
  const result = await ReviewModel.find({ userId, isDeleted: false })
    .populate("bookId", "title author")
    .sort({ createdAt: -1 });
  return result;
};

const getReviewsByStatus = async (status: "pending" | "approved") => {
  const result = await ReviewModel.find({ status, isDeleted: false })
    .populate("userId", "name email")
    .populate("bookId", "title author")
    .sort({ createdAt: -1 });
  return result;
};

const updateReview = async (id: string, updatedData: Partial<Review>) => {
  try {
    const review = await ReviewModel.findById(id);

    if (!review) {
      return null;
    }

    if (updatedData.rating !== undefined) review.rating = updatedData.rating;
    if (updatedData.comment !== undefined) review.comment = updatedData.comment;
    if (updatedData.status !== undefined) review.status = updatedData.status;

    const updatedReview = await review.save();
    return updatedReview;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

const deleteReviewInDB = async (id: string) => {
  const result = await ReviewModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};

export const ReviewServices = {
  createReview,
  getAllReviewsFromDB,
  getReviewByIdFromDB,
  getReviewsByBookId,
  getReviewsByUserId,
  getReviewsByStatus,
  updateReview,
  deleteReviewInDB,
};
