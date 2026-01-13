import { Genre } from './genre.interface';
import mongoose, { Schema, Model } from "mongoose";

const genreSchema = new Schema<Genre>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const GenreModel: Model<Genre> = mongoose.model<Genre>(
  "Genre",
  genreSchema
);

export default GenreModel;
