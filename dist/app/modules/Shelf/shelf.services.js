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
exports.ShelfServices = void 0;
const shelf_model_1 = require("./shelf.model");
const mongoose_1 = require("mongoose");
const getUserShelf = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdObj = mongoose_1.Types.ObjectId.isValid(userId) ? new mongoose_1.Types.ObjectId(userId) : userId;
    const filter = { userId: userIdObj, isDeleted: false };
    if (status) {
        filter.status = status;
    }
    const shelfItems = yield shelf_model_1.ShelfModel.find(filter)
        .populate("bookId")
        .sort({ updatedAt: -1 });
    return shelfItems;
});
const addBookToShelf = (shelfData) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert string IDs to ObjectId if needed
    const userIdObj = typeof shelfData.userId === 'string' && mongoose_1.Types.ObjectId.isValid(shelfData.userId)
        ? new mongoose_1.Types.ObjectId(shelfData.userId)
        : shelfData.userId;
    const bookIdObj = typeof shelfData.bookId === 'string' && mongoose_1.Types.ObjectId.isValid(shelfData.bookId)
        ? new mongoose_1.Types.ObjectId(shelfData.bookId)
        : shelfData.bookId;
    // Check if book already exists in user's shelf
    const existing = yield shelf_model_1.ShelfModel.findOne({
        userId: userIdObj,
        bookId: bookIdObj,
        isDeleted: false,
    });
    if (existing) {
        // Update existing entry
        const updated = yield shelf_model_1.ShelfModel.findByIdAndUpdate(existing._id, { $set: shelfData }, { new: true });
        return updated;
    }
    const shelfItem = yield shelf_model_1.ShelfModel.create(Object.assign(Object.assign({}, shelfData), { userId: userIdObj, bookId: bookIdObj }));
    return shelfItem;
});
const updateShelfItem = (id, userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdObj = mongoose_1.Types.ObjectId.isValid(userId) ? new mongoose_1.Types.ObjectId(userId) : userId;
    const shelfItem = yield shelf_model_1.ShelfModel.findOneAndUpdate({ _id: id, userId: userIdObj, isDeleted: false }, { $set: updateData }, { new: true, runValidators: true });
    return shelfItem;
});
const deleteShelfItem = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdObj = mongoose_1.Types.ObjectId.isValid(userId) ? new mongoose_1.Types.ObjectId(userId) : userId;
    const shelfItem = yield shelf_model_1.ShelfModel.findOneAndUpdate({ _id: id, userId: userIdObj }, { isDeleted: true }, { new: true });
    return shelfItem;
});
exports.ShelfServices = {
    getUserShelf,
    addBookToShelf,
    updateShelfItem,
    deleteShelfItem,
};
