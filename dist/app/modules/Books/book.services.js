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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookServices = void 0;
const book_model_1 = require("./book.model");
const createBook = (bookData) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.BookModel.create(bookData);
    return book;
});
const getAllBooks = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, genre, rating, sort = "createdAt", order = "desc", search, } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;
    // Build filter
    const filter = { isDeleted: false };
    if (genre) {
        filter.genre = genre;
    }
    if (rating) {
        filter.rating = { $gte: Number(rating) };
    }
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    const books = yield book_model_1.BookModel.find(filter)
        .populate("genre", "name")
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(Number(limit));
    const total = yield book_model_1.BookModel.countDocuments(filter);
    return {
        books,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
});
const getBookById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.BookModel.findById(id)
        .populate("genre", "name")
        .where("isDeleted")
        .equals(false);
    return book;
});
const updateBook = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.BookModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    return book;
});
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.BookModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return book;
});
exports.BookServices = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
};
