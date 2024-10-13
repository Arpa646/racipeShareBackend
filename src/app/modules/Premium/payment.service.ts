import { UserRegModel } from "../Registration/user.model";

const confirmationService = async (_id: string) => {
  console.log("hit this is update"); // Corrected console log statement

  try {
    // Find user by ID and update the 'isPremium' field to true
    const result = await UserRegModel.findOneAndUpdate(
      { _id }, // Find the user by _id
      {
        isPremium: true, // Update isPremium to true
      },
      { new: true } // Option to return the updated document
    );

    if (!result) {
      throw new Error("User not found or update failed");
    }

    console.log("User updated to premium:", result); // Log the updated result

    return result; // Return the updated user document
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export const paymentServices = { confirmationService };
