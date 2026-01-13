import { Review } from './review.interface';
import mongoose, { Schema, Model } from "mongoose";

const reviewSchema = new Schema<Review>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  } as any,
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  } as any,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Create a non-unique index for performance (allows multiple reviews per user per book)
// This explicitly allows users to create multiple reviews for the same book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: false });

const ReviewModel: Model<Review> = mongoose.model<Review>(
  "Review",
  reviewSchema
);

// Function to drop the unique index if it exists
// Call this once after connecting to MongoDB
export const dropUniqueReviewIndex = async () => {
  try {
    const indexes = await ReviewModel.collection.indexes();
    const uniqueIndex = indexes.find(
      (idx: any) => 
        idx.key?.userId === 1 && 
        idx.key?.bookId === 1 && 
        idx.unique === true
    );
    
    if (uniqueIndex) {
      const indexName = uniqueIndex.name as string | undefined;
      if (indexName) {
        await ReviewModel.collection.dropIndex(indexName);
        console.log('✅ Dropped unique index on userId and bookId. Users can now create multiple reviews for the same book.');
        return;
      }
    }
    
    // Try dropping by the standard index name if not found above
    try {
      await ReviewModel.collection.dropIndex('userId_1_bookId_1');
      console.log('✅ Dropped unique index on userId and bookId. Users can now create multiple reviews for the same book.');
    } catch (dropError: any) {
      if (dropError.code === 27 || dropError.codeName === 'IndexNotFound') {
        console.log('ℹ️  No unique index found - users can already create multiple reviews per book.');
      } else {
        throw dropError;
      }
    }
  } catch (error: any) {
    // Index might not exist or already dropped
    if (error.code === 27 || error.codeName === 'IndexNotFound') {
      console.log('ℹ️  Unique index not found (already removed or never existed).');
    } else {
      console.error('⚠️  Error checking/dropping index:', error.message);
    }
  }
};

export default ReviewModel;
