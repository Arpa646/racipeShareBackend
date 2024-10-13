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
exports.paymentServices = void 0;
const user_model_1 = require("../Registration/user.model");
const confirmationService = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hit this is update"); // Corrected console log statement
    try {
        // Find user by ID and update the 'isPremium' field to true
        const result = yield user_model_1.UserRegModel.findOneAndUpdate({ _id }, // Find the user by _id
        {
            isPremium: true, // Update isPremium to true
        }, { new: true } // Option to return the updated document
        );
        if (!result) {
            throw new Error("User not found or update failed");
        }
        console.log("User updated to premium:", result); // Log the updated result
        return result; // Return the updated user document
    }
    catch (error) {
        console.error("Error confirming payment:", error);
        throw error; // Re-throw the error to handle it in the calling function
    }
});
exports.paymentServices = { confirmationService };
