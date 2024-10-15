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
Object.defineProperty(exports, "__esModule", { value: true });
exports.premiumServices = exports.makePremium = void 0;
const user_model_1 = require("./../Registration/user.model");
const payment_utils_1 = require("./payment.utils");
const uuid_1 = require("uuid");
const makePremium = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by their ID
        const userInfo = yield user_model_1.UserRegModel.findOne({ _id: userId });
        if (!userInfo) {
            throw new Error("User not found");
        }
        // Generate a unique transaction ID
        const transactionId = (0, uuid_1.v4)();
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
        const paymentResponse = yield (0, payment_utils_1.initiatePayment)(paymentData);
        // Log the payment response (optional)
        //console.log("Payment response:", paymentResponse);
        // Return the payment response data
        return paymentResponse.data;
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(`Failed to make user premium: ${err.message}`);
        }
        else {
            throw new Error("Failed to make user premium: Unknown error");
        }
    }
});
exports.makePremium = makePremium;
// Aamarpay payment initiation logic
exports.premiumServices = {
    makePremium: exports.makePremium,
};
