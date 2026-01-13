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
exports.ShelfServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shelf_model_1 = __importDefault(require("./shelf.model"));
const createShelf = (shelfData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newShelf = yield shelf_model_1.default.create([shelfData], { session });
        yield session.commitTransaction();
        session.endSession();
        return newShelf;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getAllShelvesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shelf_model_1.default.find({ isDeleted: false })
        .populate("userId", "name email")
        .populate("bookId", "title author")
        .sort({ updatedAt: -1 });
    return result;
});
const getShelfByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shelf_model_1.default.findOne({ _id: id, isDeleted: false })
        .populate("userId", "name email")
        .populate("bookId", "title author");
    return result;
});
const getShelvesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shelf_model_1.default.find({ userId, isDeleted: false })
        .populate("bookId", "title author coverImage")
        .sort({ updatedAt: -1 });
    return result;
});
const getShelvesByBookId = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shelf_model_1.default.find({ bookId, isDeleted: false })
        .populate("userId", "name email")
        .sort({ updatedAt: -1 });
    return result;
});
const getShelfByUserAndBook = (userId, bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shelf_model_1.default.findOne({ userId, bookId, isDeleted: false })
        .populate("bookId", "title author");
    return result;
});
const updateShelf = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shelf = yield shelf_model_1.default.findById(id);
        if (!shelf) {
            return null;
        }
        if (updatedData.status !== undefined)
            shelf.status = updatedData.status;
        if (updatedData.progress !== undefined) {
            shelf.progress = Math.max(0, Math.min(100, updatedData.progress));
        }
        const updatedShelf = yield shelf.save();
        return updatedShelf;
    }
    catch (error) {
        console.error("Error updating shelf:", error);
        throw error;
    }
});
const deleteShelfInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shelf_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    return result;
});
exports.ShelfServices = {
    createShelf,
    getAllShelvesFromDB,
    getShelfByIdFromDB,
    getShelvesByUserId,
    getShelvesByBookId,
    getShelfByUserAndBook,
    updateShelf,
    deleteShelfInDB,
};
