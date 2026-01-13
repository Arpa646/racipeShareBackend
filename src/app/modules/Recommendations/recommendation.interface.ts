export interface BookRecommendation {
  book: any; // Book document with populated fields
  averageRating: number;
  totalRatings: number;
  recommendationReason: string; // "Why this book?" explanation
  matchScore?: number; // Optional score for ranking
}

export interface RecommendationResponse {
  recommendations: BookRecommendation[];
  userStats?: {
    readBooksCount: number;
    favoriteGenres: string[];
    averageUserRating: number;
  };
  fallbackUsed: boolean; // Whether fallback recommendations were used
}
