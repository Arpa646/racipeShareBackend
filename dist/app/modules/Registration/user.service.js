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
exports.UserServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
//creating data into db using rollback and transiction
const createUserIntoDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    //creating session
    console.log("ddd", userData);
    const session = yield mongoose_1.default.startSession();
    try {
        //start transaction
        session.startTransaction();
        const newUser = yield user_model_1.UserRegModel.create([userData], { session });
        yield session.commitTransaction();
        session.endSession();
        console.log("........", newUser);
        return newUser;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserRegModel.find({ isDeleted: false }); // Filter for isDeleted being false
    if (!result || result.length === 0) { // Check if result is empty
        throw new Error("No data Found");
    }
    return result;
});
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('hii', id);
    const result = yield user_model_1.UserRegModel.findOne({ _id: id });
    return result;
});
const deleteUserInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //const result1 = await FacilityModel.findOne(_id: id)
    // console.log('this is data',result1)
    const result = yield user_model_1.UserRegModel.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    // if (!result) {
    //   throw new Error("No data Found");
    // }
    return result;
});
const updateUserStatusInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    // Find the user by id to get the current value of isBlock
    const user = yield user_model_1.UserRegModel.findById(id);
    if (!user) {
        throw new Error("No user found with this ID");
    }
    // Toggle the isBlock field to the opposite of its current value
    const result = yield user_model_1.UserRegModel.findOneAndUpdate({ _id: id }, // Find the user by _id
    {
        isBlock: !user.isBlock, // Toggle isBlock
    }, { new: true } // Return the updated document
    );
    if (!result) {
        throw new Error("Failed to update user");
    }
    console.log(result);
    return result;
});
const updateUserProfile = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by ID and update the relevant fields
        const updatedUser = yield user_model_1.UserRegModel.findByIdAndUpdate(userId, {
            $set: {
                name: updateData.name,
                email: updateData.email,
                phone: updateData.phone,
                address: updateData.address
            }
        }, { new: true, runValidators: true } // Return the updated document, and run validators
        );
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.UserServices = {
    createUserIntoDB,
    getAllUserFromDB,
    getUserByIdFromDB,
    deleteUserInDB,
    updateUserProfile
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
