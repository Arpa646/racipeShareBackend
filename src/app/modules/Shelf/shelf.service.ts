import mongoose from "mongoose";
import { Shelf } from "./shelf.interface";
import ShelfModel from "./shelf.model";

const createShelf = async (shelfData: Shelf) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newShelf = await ShelfModel.create([shelfData], { session });
    await session.commitTransaction();
    session.endSession();
    return newShelf;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getAllShelvesFromDB = async () => {
  const result = await ShelfModel.find({ isDeleted: false })
    .populate("userId", "name email")
    .populate("bookId", "title author")
    .sort({ updatedAt: -1 });
  return result;
};

const getShelfByIdFromDB = async (id: string) => {
  const result = await ShelfModel.findOne({ _id: id, isDeleted: false })
    .populate("userId", "name email")
    .populate("bookId", "title author");
  return result;
};

const getShelvesByUserId = async (userId: string) => {
  const result = await ShelfModel.find({ userId, isDeleted: false })
    .populate("bookId", "title author coverImage")
    .sort({ updatedAt: -1 });
  return result;
};

const getShelvesByBookId = async (bookId: string) => {
  const result = await ShelfModel.find({ bookId, isDeleted: false })
    .populate("userId", "name email")
    .sort({ updatedAt: -1 });
  return result;
};

const getShelfByUserAndBook = async (userId: string, bookId: string) => {
  const result = await ShelfModel.findOne({ userId, bookId, isDeleted: false })
    .populate("bookId", "title author");
  return result;
};

const updateShelf = async (id: string, updatedData: Partial<Shelf>) => {
  try {
    const shelf = await ShelfModel.findById(id);

    if (!shelf) {
      return null;
    }

    if (updatedData.status !== undefined) shelf.status = updatedData.status;
    if (updatedData.progress !== undefined) {
      shelf.progress = Math.max(0, Math.min(100, updatedData.progress));
    }

    const updatedShelf = await shelf.save();
    return updatedShelf;
  } catch (error) {
    console.error("Error updating shelf:", error);
    throw error;
  }
};

const deleteShelfInDB = async (id: string) => {
  const result = await ShelfModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};

export const ShelfServices = {
  createShelf,
  getAllShelvesFromDB,
  getShelfByIdFromDB,
  getShelvesByUserId,
  getShelvesByBookId,
  getShelfByUserAndBook,
  updateShelf,
  deleteShelfInDB,
};
