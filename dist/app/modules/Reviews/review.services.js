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
exports.ReviewServices = void 0;
const review_model_1 = require("./review.model");
const book_model_1 = require("../Books/book.model");
const mongoose_1 = require("mongoose");
const getReviewsByBook = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookIdObj = mongoose_1.Types.ObjectId.isValid(bookId) ? new mongoose_1.Types.ObjectId(bookId) : bookId;
    const reviews = yield review_model_1.ReviewModel.find({
        bookId: bookIdObj,
        isApproved: true,
        isDeleted: false,
    })
        .populate("userId", "name photo")
        .sort({ createdAt: -1 });
    return reviews;
});
const createReview = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert string IDs to ObjectId if needed
    const userIdObj = typeof reviewData.userId === 'string' && mongoose_1.Types.ObjectId.isValid(reviewData.userId)
        ? new mongoose_1.Types.ObjectId(reviewData.userId)
        : reviewData.userId;
    const bookIdObj = typeof reviewData.bookId === 'string' && mongoose_1.Types.ObjectId.isValid(reviewData.bookId)
        ? new mongoose_1.Types.ObjectId(reviewData.bookId)
        : reviewData.bookId;
    // Check if user already reviewed this book
    const existing = yield review_model_1.ReviewModel.findOne({
        userId: userIdObj,
        bookId: bookIdObj,
        isDeleted: false,
    });
    if (existing) {
        // Update existing review (still pending)
        const updated = yield review_model_1.ReviewModel.findByIdAndUpdate(existing._id, {
            $set: {
                rating: reviewData.rating,
                comment: reviewData.comment,
                isApproved: false, // Reset approval status
            },
        }, { new: true });
        return updated;
    }
    const review = yield review_model_1.ReviewModel.create(Object.assign(Object.assign({}, reviewData), { userId: userIdObj, bookId: bookIdObj }));
    return review;
});
const getPendingReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.ReviewModel.find({
        isApproved: false,
        isDeleted: false,
    })
        .populate("userId", "name email")
        .populate("bookId", "title author")
        .sort({ createdAt: -1 });
    return reviews;
});
const approveReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.ReviewModel.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (review) {
        // Update book rating
        yield updateBookRating(review.bookId.toString());
    }
    return review;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.ReviewModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (review) {
        // Update book rating
        yield updateBookRating(review.bookId.toString());
    }
    return review;
});
// Helper function to update book rating
const updateBookRating = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.ReviewModel.find({
        bookId,
        isApproved: true,
        isDeleted: false,
    });
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        yield book_model_1.BookModel.findByIdAndUpdate(bookId, {
            rating: averageRating,
            totalRatings: reviews.length,
        });
    }
    else {
        yield book_model_1.BookModel.findByIdAndUpdate(bookId, {
            rating: 0,
            totalRatings: 0,
        });
    }
});
exports.ReviewServices = {
    getReviewsByBook,
    createReview,
    getPendingReviews,
    approveReview,
    deleteReview,
};
