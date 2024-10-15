import { UserRegModel } from "./../Registration/user.model";
import { initiatePayment } from "./payment.utils";
import { startSession, ObjectId } from "mongoose";
import mongoose from "mongoose";




import { v4 as uuidv4 } from "uuid";

export const makePremium = async (userId: string) => {
  try {
    // Find the user by their ID
    const userInfo = await UserRegModel.findOne({ _id: userId });

    if (!userInfo) {
      throw new Error("User not found");
    }

    // Generate a unique transaction ID
    const transactionId = uuidv4();

    // Update the user with the transaction ID
    // Save the user with the new transaction ID

    const paymentData = {
      userId,
      transactionId,

      // Add any other required payment details here
    };

  //  const savedBooking = await UserRegModel.save();

    // await UserRegModel.updateOne(
    //   { _id: userId }, // Find the user by ID
    //   { $set: { transactionId } } // Set the transactionId dynamically
    // );



    // Prepare payment data
 
    //console.log("Payment data:", paymentData);

    // Initiate Aamarpay payment with the payment data
    const paymentResponse = await initiatePayment(paymentData);

    // Log the payment response (optional)
    //console.log("Payment response:", paymentResponse);

    // Return the payment response data
    return paymentResponse.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to make user premium: ${err.message}`);
    } else {
      throw new Error("Failed to make user premium: Unknown error");
    }
  }
};

// Aamarpay payment initiation logic

export const premiumServices = {
  makePremium,

};
