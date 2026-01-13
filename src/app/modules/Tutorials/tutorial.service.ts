import mongoose from "mongoose";
import { Tutorial } from "./tutorial.interface";
import TutorialModel from "./tutorial.model";

const createTutorial = async (tutorialData: Tutorial) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newTutorial = await TutorialModel.create([tutorialData], { session });
    await session.commitTransaction();
    session.endSession();
    return newTutorial;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getAllTutorialsFromDB = async () => {
  const result = await TutorialModel.find({ isDeleted: false }).sort({ createdAt: -1 });
  return result;
};

const getTutorialByIdFromDB = async (id: string) => {
  const result = await TutorialModel.findOne({ _id: id, isDeleted: false });
  return result;
};

const updateTutorial = async (id: string, updatedData: Partial<Tutorial>) => {
  try {
    const tutorial = await TutorialModel.findById(id);

    if (!tutorial) {
      return null;
    }

    if (updatedData.title !== undefined) tutorial.title = updatedData.title;
    if (updatedData.youtubeUrl !== undefined) tutorial.youtubeUrl = updatedData.youtubeUrl;
    if (updatedData.category !== undefined) tutorial.category = updatedData.category;

    const updatedTutorial = await tutorial.save();
    return updatedTutorial;
  } catch (error) {
    console.error("Error updating tutorial:", error);
    throw error;
  }
};

const deleteTutorialInDB = async (id: string) => {
  const result = await TutorialModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};

export const TutorialServices = {
  createTutorial,
  getAllTutorialsFromDB,
  getTutorialByIdFromDB,
  updateTutorial,
  deleteTutorialInDB,
};
