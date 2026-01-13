import { Tutorial } from './tutorial.interface';
import mongoose, { Schema, Model } from "mongoose";

const tutorialSchema = new Schema<Tutorial>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
      },
      message: "Please provide a valid YouTube URL"
    }
  },
  category: {
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

const TutorialModel: Model<Tutorial> = mongoose.model<Tutorial>(
  "Tutorial",
  tutorialSchema
);

export default TutorialModel;
