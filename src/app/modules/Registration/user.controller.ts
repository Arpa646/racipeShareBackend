import { Request, Response, NextFunction } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../middleware/asynch";
import sendResponse from "../../utils/response";
import { StatusCodes } from "http-status-codes";
// import { userValidationSchema } from "./user.validation"; // Uncomment if you need validation
import { UserRegModel } from "./user.model";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user: UserData } = req.body;

    console.log(UserData);

    // Add the additional fields before creating the user
    const newUserData = {
      ...UserData,
      isDeleted: false, // Default to false since the user is newly created
      isBlocked: false, // Default to false when a user is created
      isPremium: false, // Default to false unless the user subscribes to premium
    };

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
    const result = await UserServices.createUserIntoDB(newUserData);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }
);

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUserFromDB();
  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No Data Found",
      data: [],
    });
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get the facility ID from request params
    console.log(id);
    const facility = await UserServices.getUserByIdFromDB(id);

    if (!facility) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Facility not found",
        data: null,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Facility retrieved successfully",
      data: facility,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unknown server error",
      });
    }
  }
};

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log("this is id", id);
    try {
      const result = await UserServices.deleteUserInDB(id);
      if (!result) {
        return res.status(404).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: "No Data Found",
          data: [],
        });
      }
      res.status(200).json({
        success: true,
        message: "Facility deleted successfully",
        data: result,
      });
    } catch (error: unknown) {
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Error deleting facility",
          error: error.message,
        });
      } else {
        // Handle unexpected error types
        res.status(500).json({
          success: false,
          message: "Error deleting facility",
          error: "An unexpected error occurred.",
        });
      }
    }
  }
);
const updateUserStates = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(id);
    const updateData = req.body;
    const result = await UserServices.updateUserStatusInDB(id);
    console.log("up", result);
    if (!result) {
      return res.status(404).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "No Data Found",
        data: [],
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Facility updated successfully",
      data: result,
    });
  }
);

const followUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentUserId, targetUserId } = req.body;

    // Check if both user IDs are provided
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    // Add the target user to the current user's following list
    const currentUser = await UserRegModel.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: targetUserId } },
      { new: true }
    );

    // Add the current user to the target user's followers list
    const targetUser = await UserRegModel.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { followers: currentUserId } },
      { new: true }
    );

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success and the updated data
    return res.status(200).json({
      message: "Follow action successful",
      currentUser,
      targetUser,
    });
  } catch (error) {
    console.error("Follow error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const unfollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentUserId, targetUserId } = req.body;
    console.log(currentUserId, targetUserId);
    // Check if both user IDs are provided
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    // Remove the target user from the current user's following list
    const currentUser = await UserRegModel.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: targetUserId } },
      { new: true }
    );

    // Remove the current user from the target user's followers list
    const targetUser = await UserRegModel.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: currentUserId } },
      { new: true }
    );

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
  } catch (error) {
    console.error("Unfollow error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Assuming you get the user ID from a JWT middleware
    const { name, email, phone, address, image } = req.body;
    console.log(userId);
    console.log("data", name, email, phone, address, image);
    // Call the service to update the user
    const updatedUser = await UserServices.updateUserProfile(userId, {
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
  } catch (error) {
    // error টাইপ চেক করা হচ্ছে
    return res.status(500).json({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Failed to update user profile",
    });
  }
};

const changeUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid role. Role must be 'admin' or 'user'",
      });
    }

    // Check if user exists
    const user = await UserServices.getUserByIdFromDB(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user role
    const updatedUser = await UserServices.updateUserRoleInDB(id, role);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `User role updated to ${role} successfully`,
      data: updatedUser,
    });
  }
);

export const userControllers = {
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
