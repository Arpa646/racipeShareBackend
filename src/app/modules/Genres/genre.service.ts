import mongoose from "mongoose";
import { Genre } from "./genre.interface";
import GenreModel from "./genre.model";

const createGenre = async (genreData: Genre) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newGenre = await GenreModel.create([genreData], { session });
    await session.commitTransaction();
    session.endSession();
    return newGenre;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getAllGenresFromDB = async () => {
  const result = await GenreModel.find({ isDeleted: false }).sort({ name: 1 });
  return result;
};

const getGenreByIdFromDB = async (id: string) => {
  const result = await GenreModel.findOne({ _id: id, isDeleted: false });
  return result;
};

const updateGenre = async (id: string, updatedData: Partial<Genre>) => {
  try {
    const genre = await GenreModel.findById(id);

    if (!genre) {
      return null;
    }

    if (updatedData.name !== undefined) genre.name = updatedData.name;
    if (updatedData.description !== undefined) genre.description = updatedData.description;

    const updatedGenre = await genre.save();
    return updatedGenre;
  } catch (error) {
    console.error("Error updating genre:", error);
    throw error;
  }
};

const deleteGenreInDB = async (id: string) => {
  const result = await GenreModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};

export const GenreServices = {
  createGenre,
  getAllGenresFromDB,
  getGenreByIdFromDB,
  updateGenre,
  deleteGenreInDB,
};
