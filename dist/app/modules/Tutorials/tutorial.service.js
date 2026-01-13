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
exports.TutorialServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tutorial_model_1 = __importDefault(require("./tutorial.model"));
const createTutorial = (tutorialData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newTutorial = yield tutorial_model_1.default.create([tutorialData], { session });
        yield session.commitTransaction();
        session.endSession();
        return newTutorial;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getAllTutorialsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tutorial_model_1.default.find({ isDeleted: false }).sort({ createdAt: -1 });
    return result;
});
const getTutorialByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tutorial_model_1.default.findOne({ _id: id, isDeleted: false });
    return result;
});
const updateTutorial = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tutorial = yield tutorial_model_1.default.findById(id);
        if (!tutorial) {
            return null;
        }
        if (updatedData.title !== undefined)
            tutorial.title = updatedData.title;
        if (updatedData.youtubeUrl !== undefined)
            tutorial.youtubeUrl = updatedData.youtubeUrl;
        if (updatedData.category !== undefined)
            tutorial.category = updatedData.category;
        const updatedTutorial = yield tutorial.save();
        return updatedTutorial;
    }
    catch (error) {
        console.error("Error updating tutorial:", error);
        throw error;
    }
});
const deleteTutorialInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tutorial_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    return result;
});
exports.TutorialServices = {
    createTutorial,
    getAllTutorialsFromDB,
    getTutorialByIdFromDB,
    updateTutorial,
    deleteTutorialInDB,
};
