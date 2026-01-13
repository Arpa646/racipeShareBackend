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
exports.StatsServices = void 0;
const shelf_model_1 = require("../Shelf/shelf.model");
const book_model_1 = require("../Books/book.model");
const review_model_1 = require("../Reviews/review.model");
const user_model_1 = require("../Registration/user.model");
const genre_model_1 = require("../Genres/genre.model");
const mongoose_1 = require("mongoose");
const getUserStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdObj = mongoose_1.Types.ObjectId.isValid(userId) ? new mongoose_1.Types.ObjectId(userId) : userId;
    // Get user's shelf data
    const shelfItems = yield shelf_model_1.ShelfModel.find({
        userId: userIdObj,
        isDeleted: false,
    }).populate("bookId", "pages");
    const completedBooks = shelfItems.filter((item) => item.status === "completed");
    const currentlyReading = shelfItems.filter((item) => item.status === "currently-reading");
    const wantToRead = shelfItems.filter((item) => item.status === "want-to-read");
    // Calculate total pages read
    let totalPages = 0;
    completedBooks.forEach((item) => {
        if (item.bookId && item.bookId.pages) {
            totalPages += item.bookId.pages;
        }
    });
    // Calculate reading streak (simplified - days with reading activity in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const allShelfItems = yield shelf_model_1.ShelfModel.find({
        userId: userIdObj,
        isDeleted: false,
    });
    const recentActivity = allShelfItems
        .filter((item) => item.updatedAt && new Date(item.updatedAt) >= thirtyDaysAgo)
        .map((item) => item.updatedAt);
    // Count unique days
    const uniqueDays = new Set(recentActivity.map((date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }));
    const streak = uniqueDays.size;
    return {
        booksRead: completedBooks.length,
        booksReading: currentlyReading.length,
        booksWantToRead: wantToRead.length,
        totalPages,
        streak,
    };
});
const getAdminStats = () => __awaiter(void 0, void 0, void 0, function* () {
    // Total counts
    const totalBooks = yield book_model_1.BookModel.countDocuments({ isDeleted: false });
    const totalUsers = yield user_model_1.UserRegModel.countDocuments({ isDeleted: false });
    const totalGenres = yield genre_model_1.GenreModel.countDocuments({ isDeleted: false });
    const totalReviews = yield review_model_1.ReviewModel.countDocuments({
        isApproved: true,
        isDeleted: false,
    });
    const pendingReviews = yield review_model_1.ReviewModel.countDocuments({
        isApproved: false,
        isDeleted: false,
    });
    // Books by genre
    const booksByGenre = yield book_model_1.BookModel.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: "$genre",
                count: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: "genres",
                localField: "_id",
                foreignField: "_id",
                as: "genreInfo",
            },
        },
        {
            $project: {
                genre: { $arrayElemAt: ["$genreInfo.name", 0] },
                count: 1,
            },
        },
    ]);
    // Top rated books
    const topRatedBooks = yield book_model_1.BookModel.find({ isDeleted: false })
        .populate("genre", "name")
        .sort({ rating: -1, totalRatings: -1 })
        .limit(10)
        .select("title author rating totalRatings genre");
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBooks = yield book_model_1.BookModel.countDocuments({
        isDeleted: false,
        createdAt: { $gte: thirtyDaysAgo },
    });
    const recentUsers = yield user_model_1.UserRegModel.countDocuments({
        isDeleted: false,
        createdAt: { $gte: thirtyDaysAgo },
    });
    return {
        totals: {
            books: totalBooks,
            users: totalUsers,
            genres: totalGenres,
            reviews: totalReviews,
            pendingReviews,
        },
        booksByGenre,
        topRatedBooks,
        recentActivity: {
            books: recentBooks,
            users: recentUsers,
        },
    };
});
exports.StatsServices = {
    getUserStats,
    getAdminStats,
};
