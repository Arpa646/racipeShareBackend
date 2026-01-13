import mongoose from "mongoose";
import BookModel from "../Books/book.model";
import ShelfModel from "../Shelf/shelf.model";
import ReviewModel from "../Reviews/review.model";
import { BookRecommendation, RecommendationResponse } from "./recommendation.interface";

/**
 * Get personalized book recommendations for a user
 */
const getPersonalizedRecommendations = async (userId: string): Promise<RecommendationResponse> => {
  try {
    // Step 1: Get user's "read" shelf books with genre populated
    const readShelves = await ShelfModel.find({
      userId: new mongoose.Types.ObjectId(userId),
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
      .map((shelf: any) => shelf.bookId)
      .filter((book: any) => book && !book.isDeleted && book.isPublished);

    const readBookIds = readBooks.map((book: any) => book._id);

    // Step 2: Calculate user stats
    const userStats = {
      readBooksCount: readBooks.length,
      favoriteGenres: [] as string[],
      averageUserRating: 0,
    };

    // Get user's reviews to calculate average rating
    const userReviews = await ReviewModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    }).lean();

    if (userReviews.length > 0) {
      const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
      userStats.averageUserRating = Math.round((totalRating / userReviews.length) * 10) / 10;
    }

    // Extract genre IDs from read books (genre can be ObjectId or populated object)
    const genreCount: { [key: string]: number } = {};
    readBooks.forEach((book: any) => {
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

    let recommendations: BookRecommendation[] = [];

    if (useFallback) {
      // Fallback: Popular books + random books
      recommendations = await getFallbackRecommendations(userId, readBookIds);
    } else {
      // Personalized recommendations based on user's reading history
      recommendations = await getPersonalizedRecommendationsForUser(
        userId,
        readBookIds,
        userStats.favoriteGenres,
        userStats.averageUserRating
      );
    }

    // Limit to 12-18 recommendations
    const targetCount = Math.min(Math.max(12, recommendations.length), 18);
    recommendations = recommendations.slice(0, targetCount);

    return {
      recommendations,
      userStats,
      fallbackUsed: useFallback,
    };
  } catch (error) {
    console.error("Error getting personalized recommendations:", error);
    throw error;
  }
};

/**
 * Get personalized recommendations based on user's reading history
 */
const getPersonalizedRecommendationsForUser = async (
  userId: string,
  readBookIds: any[],
  favoriteGenres: string[],
  averageUserRating: number
): Promise<BookRecommendation[]> => {
  const recommendations: BookRecommendation[] = [];

  // Get all books excluding user's read books
  const excludeBookIds = readBookIds.map((id) => new mongoose.Types.ObjectId(id));

  // Build query for books in favorite genres (convert genre IDs to ObjectIds)
  const genreQuery = favoriteGenres.length > 0 
    ? { genre: { $in: favoriteGenres.map((id) => new mongoose.Types.ObjectId(id)) } }
    : {};

  const candidateBooks = await BookModel.find({
    _id: { $nin: excludeBookIds },
    isDeleted: false,
    isPublished: true,
    ...genreQuery,
  })
    .populate("genre")
    .lean();

  if (candidateBooks.length === 0) {
    // If no books in favorite genres, get books from any genre
    const allBooks = await BookModel.find({
      _id: { $nin: excludeBookIds },
      isDeleted: false,
      isPublished: true,
    })
      .populate("genre")
      .limit(50)
      .lean();
    candidateBooks.push(...allBooks);
  }

  // Get ratings for candidate books
  const bookIds = candidateBooks.map((book: any) => book._id);
  const ratingAggregation = await ReviewModel.aggregate([
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
    const reasons: string[] = [];

    // Genre match (handle both populated genre object and ObjectId)
    let bookGenreId: string | null = null;
    let genreName: string = 'this genre';
    
    if (book.genre) {
      if (typeof book.genre === 'object' && book.genre !== null && '_id' in book.genre) {
        // Populated genre object
        bookGenreId = (book.genre as any)._id.toString();
        genreName = (book.genre as any).name || 'this genre';
      } else {
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
};

/**
 * Get fallback recommendations (popular books + random books)
 */
const getFallbackRecommendations = async (
  userId: string,
  excludeBookIds: any[]
): Promise<BookRecommendation[]> => {
  const recommendations: BookRecommendation[] = [];
  const excludeIds = excludeBookIds.map((id) => new mongoose.Types.ObjectId(id));

  // Get all published books
  const allBooks = await BookModel.find({
    _id: { $nin: excludeIds },
    isDeleted: false,
    isPublished: true,
  }).lean();

  if (allBooks.length === 0) {
    return recommendations;
  }

  const bookIds = allBooks.map((book: any) => book._id);

  // Get ratings and shelf counts
  const ratingAggregation = await ReviewModel.aggregate([
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
  const shelfCountAggregation = await ShelfModel.aggregate([
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

    const reasons: string[] = [];

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
  const remaining = recommendations.filter(
    (r) => !topRated.some((tr) => tr.book._id.toString() === r.book._id.toString())
  );
  const shuffled = remaining.sort(() => Math.random() - 0.5);
  const random = shuffled.slice(0, 8);

  // Combine: top rated + random
  const combined = [...topRated, ...random];

  // Update reasons for fallback
  return combined.map((rec) => ({
    ...rec,
    recommendationReason: rec.recommendationReason || "Popular book in our community",
  }));
};

export const RecommendationServices = {
  getPersonalizedRecommendations,
};
