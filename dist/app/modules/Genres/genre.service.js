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
exports.GenreServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const genre_model_1 = __importDefault(require("./genre.model"));
const createGenre = (genreData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newGenre = yield genre_model_1.default.create([genreData], { session });
        yield session.commitTransaction();
        session.endSession();
        return newGenre;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getAllGenresFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield genre_model_1.default.find({ isDeleted: false }).sort({ name: 1 });
    return result;
});
const getGenreByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield genre_model_1.default.findOne({ _id: id, isDeleted: false });
    return result;
});
const updateGenre = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genre = yield genre_model_1.default.findById(id);
        if (!genre) {
            return null;
        }
        if (updatedData.name !== undefined)
            genre.name = updatedData.name;
        if (updatedData.description !== undefined)
            genre.description = updatedData.description;
        const updatedGenre = yield genre.save();
        return updatedGenre;
    }
    catch (error) {
        console.error("Error updating genre:", error);
        throw error;
    }
});
const deleteGenreInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield genre_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    return result;
});
exports.GenreServices = {
    createGenre,
    getAllGenresFromDB,
    getGenreByIdFromDB,
    updateGenre,
    deleteGenreInDB,
};
