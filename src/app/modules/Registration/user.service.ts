import { startSession } from "mongoose";
import mongoose from "mongoose";
import { IUser } from "./user.interface";
import { UserRegModel } from "./user.model";

//creating data into db using rollback and transiction
const createUserIntoDB = async (userData: IUser) => {
  //creating session
  console.log("ddd", userData);
  const session = await mongoose.startSession();

  try {
    //start transaction
    session.startTransaction();
    const newUser = await UserRegModel.create([userData], { session });
    await session.commitTransaction();
    session.endSession();
    console.log("........", newUser);
    return newUser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getAllUserFromDB = async () => {
  const result = await UserRegModel.find({ isDeleted: false }); // Filter for isDeleted being false
  if (!result || result.length === 0) {
    // Check if result is empty
    throw new Error("No data Found");
  }
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  console.log("hii", id);
  const result = await UserRegModel.findOne({ _id: id });
  return result;
};

const deleteUserInDB = async (id: string) => {
  //const result1 = await FacilityModel.findOne(_id: id)
  // console.log('this is data',result1)
  const result = await UserRegModel.findByIdAndUpdate(
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

const updateUserStatusInDB = async (id: string) => {
  console.log(id);

  // Find the user by id to get the current value of isBlock
  const user = await UserRegModel.findById(id);

  if (!user) {
    throw new Error("No user found with this ID");
  }

  // Toggle the isBlock field to the opposite of its current value
  const result = await UserRegModel.findOneAndUpdate(
    { _id: id }, // Find the user by _id
    {
      isBlock: !user.isBlock, // Toggle isBlock
    },
    { new: true } // Return the updated document
  );

  if (!result) {
    throw new Error("Failed to update user");
  }

  console.log(result);
  return result;
};




interface UpdateUserData {
  name?: string; // Optional field
  email?: string; // Optional field
  phone?: string; // Optional field
  address?: string; // Optional field
}
const updateUserProfile = async (
  userId: string,
  updateData: UpdateUserData
) => {
  try {
    // Find the user by ID and update the relevant fields
    const updatedUser = await UserRegModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: updateData.name,
          email: updateData.email,
          phone: updateData.phone,
          address: updateData.address,
        },
      },
      { new: true, runValidators: true } // Return the updated document, and run validators
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error: unknown) {
    // Type assertion to Error
    if (error instanceof Error) {
      throw new Error(error.message); // Safely access the message property
    }
    throw new Error("An unknown error occurred"); // Fallback for unknown error type
  }
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getUserByIdFromDB,
  deleteUserInDB,
  updateUserStatusInDB,
  updateUserProfile,
};
// const createFacultyIntoDB = async (password: string, payload: TFaculty) => {

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const newFaculty = await Faculty.create([payload], { session });

//     await session.commitTransaction();
//     await session.endSession();

//     return newFaculty;
//   } catch (err: any) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new Error(err);
//   }
// };
