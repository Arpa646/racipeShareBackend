import mongoose from "mongoose";
import GenreModel from "../app/modules/Genres/genre.model";

const dummyGenres = [
  {
    name: "Fiction",
    description: "Literary works of imagination, including novels, short stories, and novellas that are not based on real events.",
  },
  {
    name: "Non-Fiction",
    description: "Books based on facts, real events, and real people, such as biography, history, and self-help books.",
  },
  {
    name: "Science Fiction",
    description: "Fiction that deals with imaginative content such as futuristic settings, futuristic science and technology, space travel, time travel, faster than light travel, parallel universes, and extraterrestrial life.",
  },
  {
    name: "Fantasy",
    description: "Fiction that uses magic or other supernatural elements as a main plot element, theme, or setting.",
  },
  {
    name: "Mystery",
    description: "Fiction in which a detective or other professional solves a crime or series of crimes.",
  },
  {
    name: "Thriller",
    description: "Fiction that provides excitement, suspense, and high levels of anticipation.",
  },
  {
    name: "Romance",
    description: "Fiction that focuses on the relationship and romantic love between two people.",
  },
  {
    name: "Horror",
    description: "Fiction intended to scare, unsettle, or horrify the reader.",
  },
  {
    name: "Biography",
    description: "An account of someone's life written by someone else.",
  },
  {
    name: "Autobiography",
    description: "An account of a person's life written by that person.",
  },
  {
    name: "History",
    description: "Books about past events, particularly in human affairs.",
  },
  {
    name: "Philosophy",
    description: "Books that explore fundamental questions about existence, knowledge, values, reason, mind, and language.",
  },
  {
    name: "Self-Help",
    description: "Books intended to help readers solve personal problems and improve their lives.",
  },
  {
    name: "Business",
    description: "Books about business management, entrepreneurship, finance, and economics.",
  },
  {
    name: "Science",
    description: "Books about scientific topics, discoveries, and research.",
  },
  {
    name: "Technology",
    description: "Books about technological advances, programming, and digital innovation.",
  },
  {
    name: "Health & Fitness",
    description: "Books about physical health, mental wellness, exercise, and nutrition.",
  },
  {
    name: "Travel",
    description: "Books about travel experiences, destinations, and travel guides.",
  },
  {
    name: "Cooking",
    description: "Books containing recipes, cooking techniques, and culinary information.",
  },
  {
    name: "Poetry",
    description: "Literary work in which special intensity is given to the expression of feelings and ideas by the use of distinctive style and rhythm.",
  },
  {
    name: "Drama",
    description: "Literature intended for performance, including plays and scripts.",
  },
  {
    name: "Comedy",
    description: "Fiction intended to be humorous or amusing.",
  },
  {
    name: "Adventure",
    description: "Fiction that involves exciting, dangerous, or risky experiences.",
  },
  {
    name: "Young Adult",
    description: "Fiction written for readers aged 12 to 18, dealing with themes relevant to teenagers.",
  },
  {
    name: "Children's",
    description: "Books written for children, including picture books, early readers, and middle-grade fiction.",
  },
];

async function seedGenres() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://sportFacility:eE8vmF9Tq8ebFt5s@cluster0.eep6yze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");

    // Clear existing genres (optional - comment out if you want to keep existing genres)
    // await GenreModel.deleteMany({});
    // console.log("Cleared existing genres");

    // Add default fields to each genre
    const genresWithDefaults = dummyGenres.map((genre) => ({
      ...genre,
      isDeleted: false,
    }));

    // Insert genres
    const result = await GenreModel.insertMany(genresWithDefaults, { ordered: false });
    console.log(`✅ Successfully seeded ${result.length} genres!`);
    console.log("\n📚 Genres created:");
    result.forEach((genre, index) => {
      console.log(`${index + 1}. ${genre.name} - ${genre.description?.substring(0, 50)}...`);
    });

    process.exit(0);
  } catch (error: any) {
    if (error.code === 11000) {
      console.log("Some genres already exist. Skipping duplicates.");
      console.log(`✅ Process completed. Check your database for genres.`);
    } else {
      console.error("Error seeding genres:", error);
    }
    process.exit(1);
  }
}

seedGenres();
