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
exports.RecommendationServices = void 0;
const book_model_1 = require("../Books/book.model");
const shelf_model_1 = require("../Shelf/shelf.model");
const mongoose_1 = require("mongoose");
const getPersonalizedRecommendations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdObj = mongoose_1.Types.ObjectId.isValid(userId) ? new mongoose_1.Types.ObjectId(userId) : userId;
    // Get user's reading history
    const userShelf = yield shelf_model_1.ShelfModel.find({
        userId: userIdObj,
        isDeleted: false,
    }).select("bookId status");
    const readBookIds = userShelf
        .filter((item) => item.status === "completed" || item.status === "currently-reading")
        .map((item) => item.bookId);
    // Get user's favorite genres from completed books
    const completedBooks = yield shelf_model_1.ShelfModel.find({
        userId: userIdObj,
        status: "completed",
        isDeleted: false,
    })
        .populate("bookId", "genre")
        .select("bookId");
    const favoriteGenres = [];
    completedBooks.forEach((item) => {
        if (item.bookId && item.bookId.genre) {
            favoriteGenres.push(item.bookId.genre.toString());
        }
    });
    // Get genre frequency
    const genreCount = {};
    favoriteGenres.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
    const topGenres = Object.keys(genreCount)
        .sort((a, b) => genreCount[b] - genreCount[a])
        .slice(0, 3);
    // Recommend books from favorite genres that user hasn't read
    const recommendations = yield book_model_1.BookModel.find({
        _id: { $nin: readBookIds },
        genre: { $in: topGenres },
        isDeleted: false,
    })
        .populate("genre", "name")
        .sort({ rating: -1, totalRatings: -1 })
        .limit(10);
    // If not enough recommendations, add popular books
    if (recommendations.length < 10) {
        const popularBooks = yield book_model_1.BookModel.find({
            _id: { $nin: [...readBookIds, ...recommendations.map((b) => b._id)] },
            isDeleted: false,
        })
            .populate("genre", "name")
            .sort({ rating: -1, totalRatings: -1 })
            .limit(10 - recommendations.length);
        recommendations.push(...popularBooks);
    }
    return recommendations.slice(0, 10);
});
const getPopularRecommendations = () => __awaiter(void 0, void 0, void 0, function* () {
    const popularBooks = yield book_model_1.BookModel.find({ isDeleted: false })
        .populate("genre", "name")
        .sort({ rating: -1, totalRatings: -1 })
        .limit(20);
    return popularBooks;
});
exports.RecommendationServices = {
    getPersonalizedRecommendations,
    getPopularRecommendations,
};
