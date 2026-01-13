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
exports.userControllers = void 0;
const user_service_1 = require("./user.service");
const asynch_1 = __importDefault(require("../../middleware/asynch"));
const response_1 = __importDefault(require("../../utils/response"));
const http_status_codes_1 = require("http-status-codes");
// import { userValidationSchema } from "./user.validation"; // Uncomment if you need validation
const user_model_1 = require("./user.model");
const createUser = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: UserData } = req.body;
    console.log(UserData);
    // Add the additional fields before creating the user
    const newUserData = Object.assign(Object.assign({}, UserData), { isDeleted: false, isBlocked: false, isPremium: false });
    // Validation before creating user in the database
    // const resultvalidate = userValidationSchema.safeParse(newUserData);
    // if (!resultvalidate.success) {
    //   console.log(resultvalidate.error.errors);
    //   return res.status(400).json({
    //     success: false,
    //     message: "Validation failed",
    //     errors: resultvalidate.error.errors,
    //   });
    // } else {
    //   console.log("Validation succeeded", resultvalidate.data);
    // }
    // Creating user in the database with newUserData
    const result = yield user_service_1.UserServices.createUserIntoDB(newUserData);
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User registered successfully",
        data: result,
    });
}));
const getAllUser = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllUserFromDB();
    if (result.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No Data Found",
            data: [],
        });
    }
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
}));
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the facility ID from request params
        console.log(id);
        const facility = yield user_service_1.UserServices.getUserByIdFromDB(id);
        if (!facility) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Facility not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Facility retrieved successfully",
            data: facility,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server error",
                error: err.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Unknown server error",
            });
        }
    }
});
const deleteUser = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("this is id", id);
    try {
        const result = yield user_service_1.UserServices.deleteUserInDB(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "No Data Found",
                data: [],
            });
        }
        res.status(200).json({
            success: true,
            message: "Facility deleted successfully",
            data: result,
        });
    }
    catch (error) {
        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: "Error deleting facility",
                error: error.message,
            });
        }
        else {
            // Handle unexpected error types
            res.status(500).json({
                success: false,
                message: "Error deleting facility",
                error: "An unexpected error occurred.",
            });
        }
    }
}));
const updateUserStates = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    const updateData = req.body;
    const result = yield user_service_1.UserServices.updateUserStatusInDB(id);
    console.log("up", result);
    if (!result) {
        return res.status(404).json({
            success: false,
            statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: "No Data Found",
            data: [],
        });
    }
    (0, response_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Facility updated successfully",
        data: result,
    });
}));
const followUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId, targetUserId } = req.body;
        // Check if both user IDs are provided
        if (!currentUserId || !targetUserId) {
            return res.status(400).json({ message: "User IDs are required" });
        }
        // Add the target user to the current user's following list
        const currentUser = yield user_model_1.UserRegModel.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } }, { new: true });
        // Add the current user to the target user's followers list
        const targetUser = yield user_model_1.UserRegModel.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } }, { new: true });
        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Respond with success and the updated data
        return res.status(200).json({
            message: "Follow action successful",
            currentUser,
            targetUser,
        });
    }
    catch (error) {
        console.error("Follow error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
const unfollowUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId, targetUserId } = req.body;
        console.log(currentUserId, targetUserId);
        // Check if both user IDs are provided
        if (!currentUserId || !targetUserId) {
            return res.status(400).json({ message: "User IDs are required" });
        }
        // Remove the target user from the current user's following list
        const currentUser = yield user_model_1.UserRegModel.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }, { new: true });
        // Remove the current user from the target user's followers list
        const targetUser = yield user_model_1.UserRegModel.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } }, { new: true });
        // Check if the users exist after the update
        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Respond with success and the updated data
        return res.status(200).json({
            message: "Unfollow action successful",
            currentUser,
            targetUser,
        });
    }
    catch (error) {
        console.error("Unfollow error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id; // Assuming you get the user ID from a JWT middleware
        const { name, email, phone, address, image } = req.body;
        console.log(userId);
        console.log("data", name, email, phone, address, image);
        // Call the service to update the user
        const updatedUser = yield user_service_1.UserServices.updateUserProfile(userId, {
            name,
            email,
            phone,
            address,
            image,
        });
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        // error টাইপ চেক করা হচ্ছে
        return res.status(500).json({
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Failed to update user profile",
        });
    }
});
const changeUserRole = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    // Validate role
    if (!role || (role !== 'admin' && role !== 'user')) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid role. Role must be 'admin' or 'user'",
        });
    }
    // Check if user exists
    const user = yield user_service_1.UserServices.getUserByIdFromDB(id);
    if (!user) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    }
    // Update user role
    const updatedUser = yield user_service_1.UserServices.updateUserRoleInDB(id, role);
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `User role updated to ${role} successfully`,
        data: updatedUser,
    });
}));
exports.userControllers = {
    createUser,
    getAllUser,
    getSingleUser,
    deleteUser,
    updateUserStates,
    followUser,
    unfollowUser,
    updateProfile,
    changeUserRole,
};
// import { UserServices } from "./user.service";
// import catchAsync from "../../middleware/asynch";
// import sendResponse from "../../utils/response";
// import { StatusCodes } from "http-status-codes";
// import { userValidationSchema } from "./user.validation";
// const createUser = catchAsync(async ((req:Request,res:Response,next:NextFunction) => {
//   const { user: UserData } = req.body;
//   console.log(UserData);
//   //validation before create user on database
//   // const resultvalidate = userValidationSchema.safeParse(UserData);
//   // if (!resultvalidate.success) {
//   //   console.log(resultvalidate.error.errors);
//   // } else {
//   //   console.log("Validation succeeded", resultvalidate.data);
//   // }
//   //creating user into database
//   const result = await UserServices.createUserIntoDB(UserData);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "User Register succesfully",
//     data: result,
//   });
// });
// const getAllUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await UserServices.getAllUserFromDB();
//   if (result.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "No Data Found",
//       data: [],
//     });
//   }
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Students are retrieved succesfully",
//     data: result,
//   });
// });
// export const userControllers = {
//   createUser,
//   getAllUser,
// };
