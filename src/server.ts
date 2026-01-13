import express from 'express';
import mongoose from 'mongoose';
import app from './app';
import { dropUniqueReviewIndex } from './app/modules/Reviews/review.model';

const port = process.env.PORT || 5000;
async function main() {

  //sportFacility //eE8vmF9Tq8ebFt5s
  try {
    await mongoose.connect("mongodb+srv://sportFacility:eE8vmF9Tq8ebFt5s@cluster0.eep6yze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  
    });

    // Drop the unique index on reviews to allow multiple reviews per user per book
    await dropUniqueReviewIndex();
  
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

main();
