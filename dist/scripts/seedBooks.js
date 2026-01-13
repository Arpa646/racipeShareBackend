"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("../app/modules/Books/book.model"));
const user_model_1 = require("../app/modules/Registration/user.model");
const dummyBooks = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A classic American novel set in the Jazz Age, following the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.",
        isbn: "978-0-7432-7356-5",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81QuEGw8VPL.jpg",
        publishedDate: new Date("1925-04-10"),
        genre: "Fiction",
        pages: 180,
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
        isbn: "978-0-441-17271-9",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81zN2U0A1kL.jpg",
        publishedDate: new Date("1965-08-01"),
        genre: "Science Fiction",
        pages: 688,
    },
    {
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        description: "A journalist and a hacker investigate a decades-old disappearance.",
        isbn: "978-0-307-26975-1",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/91Q5d6Tc6OL.jpg",
        publishedDate: new Date("2005-08-01"),
        genre: "Mystery",
        pages: 672,
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        description: "Bilbo Baggins goes on an unexpected journey to help a group of dwarves reclaim their homeland.",
        isbn: "978-0-544-17697-3",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/712cDO7d73L.jpg",
        publishedDate: new Date("1937-09-21"),
        genre: "Fantasy",
        pages: 310,
    },
    {
        title: "Steve Jobs",
        author: "Walter Isaacson",
        description: "The exclusive biography of the Apple co-founder, based on more than forty interviews with Jobs conducted over two years.",
        isbn: "978-1-4516-4853-9",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81VStYnDGrL.jpg",
        publishedDate: new Date("2011-10-24"),
        genre: "Biography",
        pages: 656,
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "The romantic story of Elizabeth Bennet and Mr. Darcy in 19th century England.",
        isbn: "978-0-14-143951-8",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg",
        publishedDate: new Date("1813-01-28"),
        genre: "Romance",
        pages: 432,
    },
    {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        description: "A murder in the Louvre museum leads to a trail of clues hidden in the works of Leonardo da Vinci.",
        isbn: "978-0-385-50420-5",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71QxYz8VHxL.jpg",
        publishedDate: new Date("2003-03-18"),
        genre: "Thriller",
        pages: 489,
    },
    {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        description: "A brief history of how Homo sapiens conquered the world.",
        isbn: "978-0-06-231609-7",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/713jIo8EGsL.jpg",
        publishedDate: new Date("2011-02-10"),
        genre: "Non-Fiction",
        pages: 443,
    },
    {
        title: "The Shining",
        author: "Stephen King",
        description: "A writer becomes the winter caretaker of an isolated hotel where his son sees terrifying visions.",
        isbn: "978-0-385-12167-5",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81Th0bAZJDL.jpg",
        publishedDate: new Date("1977-01-28"),
        genre: "Horror",
        pages: 447,
    },
    {
        title: "The Adventures of Huckleberry Finn",
        author: "Mark Twain",
        description: "The story of a young boy's journey down the Mississippi River with a runaway slave.",
        isbn: "978-0-14-243717-9",
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71h5+dp8vIL.jpg",
        publishedDate: new Date("1884-12-10"),
        genre: "Adventure",
        pages: 366,
    },
];
function seedBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect("mongodb+srv://sportFacility:eE8vmF9Tq8ebFt5s@cluster0.eep6yze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
            console.log("Connected to MongoDB");
            // Get the first user from the database
            const user = yield user_model_1.UserRegModel.findOne({ isDeleted: false });
            if (!user) {
                console.error("No user found in database. Please create a user first.");
                process.exit(1);
            }
            console.log(`Using user ID: ${user._id}`);
            // Clear existing books (optional - comment out if you want to keep existing books)
            // await BookModel.deleteMany({});
            // console.log("Cleared existing books");
            // Add user ID to each book
            const booksWithUser = dummyBooks.map((book) => (Object.assign(Object.assign({}, book), { user: user._id, isDeleted: false, isPublished: true })));
            // Insert books
            const result = yield book_model_1.default.insertMany(booksWithUser);
            console.log(`✅ Successfully seeded ${result.length} books!`);
            console.log("\n📚 Books created:");
            result.forEach((book, index) => {
                console.log(`${index + 1}. ${book.title} by ${book.author}`);
            });
            process.exit(0);
        }
        catch (error) {
            console.error("Error seeding books:", error);
            process.exit(1);
        }
    });
}
seedBooks();
