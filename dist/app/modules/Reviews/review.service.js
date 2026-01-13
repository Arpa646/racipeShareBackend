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
exports.ReviewServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const review_model_1 = __importDefault(require("./review.model"));
const createReview = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    console.log("reviewData", reviewData);
    try {
        session.startTransaction();
        console.log("   📊 Database: Starting transaction...");
        const newReview = yield review_model_1.default.create([reviewData], { session });
        yield session.commitTransaction();
        session.endSession();
        console.log("   📊 Database: Review saved successfully");
        return newReview;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        console.error("   ❌ Database Error:", err.message);
        throw new Error(err);
    }
});
const getAllReviewsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.default.find({ isDeleted: false })
        .populate("userId", "name email")
        .populate("bookId", "title author")
        .sort({ createdAt: -1 });
    return result;
});
const getReviewByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.default.findOne({ _id: id, isDeleted: false })
        .populate("userId", "name email")
        .populate("bookId", "title author");
    return result;
});
const getReviewsByBookId = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.default.find({
        bookId: new mongoose_1.default.Types.ObjectId(bookId),
        isDeleted: false,
        status: "approved"
    })
        .populate("userId", "name email")
        .populate("bookId", "title author coverImage")
        .sort({ createdAt: -1 });
    return result;
});
const getReviewsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.default.find({ userId, isDeleted: false })
        .populate("bookId", "title author")
        .sort({ createdAt: -1 });
    return result;
});
const getReviewsByStatus = (status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.default.find({ status, isDeleted: false })
        .populate("userId", "name email")
        .populate("bookId", "title author")
        .sort({ createdAt: -1 });
    return result;
});
const updateReview = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield review_model_1.default.findById(id);
        if (!review) {
            return null;
        }
        if (updatedData.rating !== undefined)
            review.rating = updatedData.rating;
        if (updatedData.comment !== undefined)
            review.comment = updatedData.comment;
        if (updatedData.status !== undefined)
            review.status = updatedData.status;
        const updatedReview = yield review.save();
        return updatedReview;
    }
    catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
});
const deleteReviewInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    return result;
});
exports.ReviewServices = {
    createReview,
    getAllReviewsFromDB,
    getReviewByIdFromDB,
    getReviewsByBookId,
    getReviewsByUserId,
    getReviewsByStatus,
    updateReview,
    deleteReviewInDB,
};
