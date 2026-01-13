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
exports.GenreServices = void 0;
const genre_model_1 = require("./genre.model");
const getAllGenres = () => __awaiter(void 0, void 0, void 0, function* () {
    const genres = yield genre_model_1.GenreModel.find({ isDeleted: false });
    return genres;
});
const createGenre = (genreData) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield genre_model_1.GenreModel.create(genreData);
    return genre;
});
const updateGenre = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield genre_model_1.GenreModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    return genre;
});
const deleteGenre = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield genre_model_1.GenreModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return genre;
});
exports.GenreServices = {
    getAllGenres,
    createGenre,
    updateGenre,
    deleteGenre,
};
