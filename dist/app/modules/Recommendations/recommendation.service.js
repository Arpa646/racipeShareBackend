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
exports.RecommendationServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("../Books/book.model"));
const shelf_model_1 = __importDefault(require("../Shelf/shelf.model"));
const review_model_1 = __importDefault(require("../Reviews/review.model"));
const genre_model_1 = __importDefault(require("../Genres/genre.model"));
/**
 * Helper function to ensure genre is populated
 */
const populateGenres = (books) => __awaiter(void 0, void 0, void 0, function* () {
    const genreIds = new Set();
    // Collect all genre IDs that need to be populated
    books.forEach((book) => {
        if (book.genre) {
            const genreId = typeof book.genre === 'object' && book.genre._id
                ? book.genre._id.toString()
                : book.genre.toString();
            if (genreId && !(typeof book.genre === 'object' && book.genre.name)) {
                genreIds.add(genreId);
            }
        }
    });
    // If all genres are already populated, return as is
    if (genreIds.size === 0) {
        return books;
    }
    // Fetch all genres that need to be populated
    const genres = yield genre_model_1.default.find({
        _id: { $in: Array.from(genreIds).map(id => new mongoose_1.default.Types.ObjectId(id)) },
        isDeleted: false,
    }).lean();
    // Create a map of genre ID to genre object
    const genreMap = new Map();
    genres.forEach((genre) => {
        genreMap.set(genre._id.toString(), genre);
    });
    // Populate genres in books
    return books.map((book) => {
        if (book.genre) {
            const genreId = typeof book.genre === 'object' && book.genre._id
                ? book.genre._id.toString()
                : book.genre.toString();
            if (genreId && !(typeof book.genre === 'object' && book.genre.name)) {
                const populatedGenre = genreMap.get(genreId);
                if (populatedGenre) {
                    book.genre = populatedGenre;
                }
            }
        }
        return book;
    });
});
/**
 * Get personalized book recommendations for a user
 */
const getPersonalizedRecommendations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Get user's "read" shelf books with genre populated
        const readShelves = yield shelf_model_1.default.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            status: "read",
            isDeleted: false,
        })
            .populate({
            path: "bookId",
            populate: {
                path: "genre",
                model: "Genre"
            }
        })
            .lean();
        const readBooks = readShelves
            .map((shelf) => shelf.bookId)
            .filter((book) => book && !book.isDeleted && book.isPublished);
        const readBookIds = readBooks.map((book) => book._id);
        // Step 2: Calculate user stats
        const userStats = {
            readBooksCount: readBooks.length,
            favoriteGenres: [],
            averageUserRating: 0,
        };
        // Get user's reviews to calculate average rating
        const userReviews = yield review_model_1.default.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            isDeleted: false,
        }).lean();
        if (userReviews.length > 0) {
            const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
            userStats.averageUserRating = Math.round((totalRating / userReviews.length) * 10) / 10;
        }
        // Extract genre IDs from read books (genre can be ObjectId or populated object)
        const genreCount = {};
        readBooks.forEach((book) => {
            if (book.genre) {
                // Handle both populated genre object and ObjectId
                const genreId = typeof book.genre === 'object' && book.genre._id
                    ? book.genre._id.toString()
                    : book.genre.toString();
                genreCount[genreId] = (genreCount[genreId] || 0) + 1;
            }
        });
        // Get top genre IDs (most common)
        userStats.favoriteGenres = Object.entries(genreCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([genreId]) => genreId);
        // Step 3: Determine if we need fallback recommendations
        const useFallback = readBooks.length < 3;
        let recommendations = [];
        if (useFallback) {
            // Fallback: Popular books + random books
            recommendations = yield getFallbackRecommendations(userId, readBookIds);
        }
        else {
            // Personalized recommendations based on user's reading history
            recommendations = yield getPersonalizedRecommendationsForUser(userId, readBookIds, userStats.favoriteGenres, userStats.averageUserRating);
        }
        // Limit to 12-18 recommendations
        const targetCount = Math.min(Math.max(12, recommendations.length), 18);
        recommendations = recommendations.slice(0, targetCount);
        return {
            recommendations,
            userStats,
            fallbackUsed: useFallback,
        };
    }
    catch (error) {
        console.error("Error getting personalized recommendations:", error);
        throw error;
    }
});
/**
 * Get personalized recommendations based on user's reading history
 */
const getPersonalizedRecommendationsForUser = (userId, readBookIds, favoriteGenres, averageUserRating) => __awaiter(void 0, void 0, void 0, function* () {
    const recommendations = [];
    // Get all books excluding user's read books
    const excludeBookIds = readBookIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
    // Build query for books in favorite genres (convert genre IDs to ObjectIds)
    const genreQuery = favoriteGenres.length > 0
        ? { genre: { $in: favoriteGenres.map((id) => new mongoose_1.default.Types.ObjectId(id)) } }
        : {};
    let candidateBooks = yield book_model_1.default.find(Object.assign({ _id: { $nin: excludeBookIds }, isDeleted: false, isPublished: true }, genreQuery))
        .populate({
        path: "genre",
        model: "Genre"
    })
        .lean();
    if (candidateBooks.length === 0) {
        // If no books in favorite genres, get books from any genre
        const allBooks = yield book_model_1.default.find({
            _id: { $nin: excludeBookIds },
            isDeleted: false,
            isPublished: true,
        })
            .populate({
            path: "genre",
            model: "Genre"
        })
            .limit(50)
            .lean();
        candidateBooks.push(...allBooks);
    }
    // Ensure genres are populated
    candidateBooks = yield populateGenres(candidateBooks);
    // Get ratings for candidate books
    const bookIds = candidateBooks.map((book) => book._id);
    const ratingAggregation = yield review_model_1.default.aggregate([
        {
            $match: {
                bookId: { $in: bookIds },
                status: "approved",
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: "$bookId",
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 },
            },
        },
    ]);
    // Create rating map
    const ratingMap = new Map();
    ratingAggregation.forEach((item) => {
        ratingMap.set(item._id.toString(), {
            averageRating: Math.round(item.averageRating * 10) / 10,
            totalRatings: item.totalRatings,
        });
    });
    // Build recommendations with explanations
    for (const book of candidateBooks) {
        const bookId = book._id.toString();
        const ratingData = ratingMap.get(bookId) || { averageRating: 0, totalRatings: 0 };
        // Calculate match score
        let matchScore = 0;
        const reasons = [];
        // Genre match (handle both populated genre object and ObjectId)
        let bookGenreId = null;
        let genreName = 'this genre';
        if (book.genre) {
            if (typeof book.genre === 'object' && book.genre !== null && '_id' in book.genre) {
                // Populated genre object
                bookGenreId = book.genre._id.toString();
                genreName = book.genre.name || 'this genre';
            }
            else {
                // ObjectId string
                bookGenreId = book.genre.toString();
            }
        }
        if (bookGenreId && favoriteGenres.includes(bookGenreId)) {
            const genreCount = favoriteGenres.filter((g) => g === bookGenreId).length;
            matchScore += 30;
            reasons.push(`Matches your preference for ${genreName} (${genreCount} book${genreCount > 1 ? 's' : ''} read)`);
        }
        // High community rating
        if (ratingData.averageRating >= 4.0 && ratingData.totalRatings >= 5) {
            matchScore += 25;
            reasons.push(`Highly rated by community (${ratingData.averageRating.toFixed(1)}/5.0 from ${ratingData.totalRatings} reviews)`);
        }
        // Matches user's rating preference
        if (averageUserRating > 0 && Math.abs(ratingData.averageRating - averageUserRating) <= 0.5) {
            matchScore += 20;
            reasons.push(`Matches your rating preference (you average ${averageUserRating.toFixed(1)}/5.0)`);
        }
        // High number of reviews (community-approved)
        if (ratingData.totalRatings >= 10) {
            matchScore += 15;
            reasons.push(`Well-reviewed by community (${ratingData.totalRatings} approved reviews)`);
        }
        // Genre similarity (even if not exact match)
        if (bookGenreId && favoriteGenres.length > 0) {
            matchScore += 10;
        }
        recommendations.push({
            book,
            averageRating: ratingData.averageRating,
            totalRatings: ratingData.totalRatings,
            recommendationReason: reasons.length > 0
                ? reasons.join(". ")
                : "Recommended based on community popularity",
            matchScore,
        });
    }
    // Sort by match score (descending), then by average rating, then by total ratings
    recommendations.sort((a, b) => {
        const aScore = a.matchScore || 0;
        const bScore = b.matchScore || 0;
        if (bScore !== aScore) {
            return bScore - aScore;
        }
        if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating;
        }
        return b.totalRatings - a.totalRatings;
    });
    return recommendations;
});
/**
 * Get fallback recommendations (popular books + random books)
 */
const getFallbackRecommendations = (userId, excludeBookIds) => __awaiter(void 0, void 0, void 0, function* () {
    const recommendations = [];
    const excludeIds = excludeBookIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
    // Get all published books
    let allBooks = yield book_model_1.default.find({
        _id: { $nin: excludeIds },
        isDeleted: false,
        isPublished: true,
    })
        .populate({
        path: "genre",
        model: "Genre"
    })
        .lean();
    if (allBooks.length === 0) {
        return recommendations;
    }
    // Ensure genres are populated
    allBooks = yield populateGenres(allBooks);
    const bookIds = allBooks.map((book) => book._id);
    // Get ratings and shelf counts
    const ratingAggregation = yield review_model_1.default.aggregate([
        {
            $match: {
                bookId: { $in: bookIds },
                status: "approved",
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: "$bookId",
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 },
            },
        },
    ]);
    // Get shelf counts (how many times book was added to shelves)
    const shelfCountAggregation = yield shelf_model_1.default.aggregate([
        {
            $match: {
                bookId: { $in: bookIds },
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: "$bookId",
                shelfCount: { $sum: 1 },
            },
        },
    ]);
    // Create maps
    const ratingMap = new Map();
    ratingAggregation.forEach((item) => {
        ratingMap.set(item._id.toString(), {
            averageRating: Math.round(item.averageRating * 10) / 10,
            totalRatings: item.totalRatings,
        });
    });
    const shelfCountMap = new Map();
    shelfCountAggregation.forEach((item) => {
        shelfCountMap.set(item._id.toString(), item.shelfCount);
    });
    // Build recommendations
    for (const book of allBooks) {
        const bookId = book._id.toString();
        const ratingData = ratingMap.get(bookId) || { averageRating: 0, totalRatings: 0 };
        const shelfCount = shelfCountMap.get(bookId) || 0;
        const reasons = [];
        // High rating
        if (ratingData.averageRating >= 4.0 && ratingData.totalRatings >= 5) {
            reasons.push(`Highly rated (${ratingData.averageRating.toFixed(1)}/5.0 from ${ratingData.totalRatings} reviews)`);
        }
        // Popular (many shelves)
        if (shelfCount >= 10) {
            reasons.push(`Popular choice (added to ${shelfCount} shelves)`);
        }
        // Well-reviewed
        if (ratingData.totalRatings >= 10) {
            reasons.push(`Well-reviewed by community (${ratingData.totalRatings} approved reviews)`);
        }
        recommendations.push({
            book,
            averageRating: ratingData.averageRating,
            totalRatings: ratingData.totalRatings,
            recommendationReason: reasons.length > 0
                ? reasons.join(". ")
                : "Popular book in our community",
            matchScore: ratingData.averageRating * 10 + shelfCount + ratingData.totalRatings,
        });
    }
    // Sort: Top 10 by average rating, then by shelf count, then random
    recommendations.sort((a, b) => {
        // First, prioritize high ratings with many reviews
        if (b.averageRating !== a.averageRating && b.totalRatings >= 5 && a.totalRatings >= 5) {
            return b.averageRating - a.averageRating;
        }
        // Then by shelf count
        const aShelfCount = shelfCountMap.get(a.book._id.toString()) || 0;
        const bShelfCount = shelfCountMap.get(b.book._id.toString()) || 0;
        if (bShelfCount !== aShelfCount) {
            return bShelfCount - aShelfCount;
        }
        // Then by total ratings
        if (b.totalRatings !== a.totalRatings) {
            return b.totalRatings - a.totalRatings;
        }
        // Finally by match score
        return (b.matchScore || 0) - (a.matchScore || 0);
    });
    // Get top 10 by rating
    const topRated = recommendations
        .filter((r) => r.averageRating >= 3.5 && r.totalRatings >= 3)
        .slice(0, 10);
    // Get some random ones from the rest
    const remaining = recommendations.filter((r) => !topRated.some((tr) => tr.book._id.toString() === r.book._id.toString()));
    const shuffled = remaining.sort(() => Math.random() - 0.5);
    const random = shuffled.slice(0, 8);
    // Combine: top rated + random
    const combined = [...topRated, ...random];
    // Update reasons for fallback
    return combined.map((rec) => (Object.assign(Object.assign({}, rec), { recommendationReason: rec.recommendationReason || "Popular book in our community" })));
});
exports.RecommendationServices = {
    getPersonalizedRecommendations,
};
