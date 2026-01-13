import { Shelf } from './shelf.interface';
import mongoose, { Schema, Model } from "mongoose";

const shelfSchema = new Schema<Shelf>({
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
  status: {
    type: String,
    enum: ["want", "reading", "read"],
    required: true,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate entries
shelfSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const ShelfModel: Model<Shelf> = mongoose.model<Shelf>(
  "Shelf",
  shelfSchema
);

export default ShelfModel;
