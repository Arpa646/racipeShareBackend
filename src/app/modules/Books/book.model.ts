import { Book } from './book.interface';
import mongoose, { Schema, Document, Model } from "mongoose";

const bookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isbn: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  publishedDate: {
    type: Date,
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: "Genre",
  },
  pages: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  } as any,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const BookModel: Model<Book> = mongoose.model<Book>(
  "Book",
  bookSchema
);

export default BookModel;
