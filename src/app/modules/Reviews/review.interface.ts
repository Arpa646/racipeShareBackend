export interface Review {
  _id?: string;
  userId: string; // User ID who wrote the review
  bookId: string; // Book ID being reviewed
  rating: number; // Rating from 1 to 5
  comment?: string; // Optional comment
  status: "pending" | "approved"; // Review status
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
