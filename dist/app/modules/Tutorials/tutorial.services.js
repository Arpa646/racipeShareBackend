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
exports.TutorialServices = void 0;
const tutorial_model_1 = require("./tutorial.model");
const getAllTutorials = () => __awaiter(void 0, void 0, void 0, function* () {
    const tutorials = yield tutorial_model_1.TutorialModel.find({ isDeleted: false })
        .sort({ order: 1, createdAt: -1 });
    return tutorials;
});
const createTutorial = (tutorialData) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorial = yield tutorial_model_1.TutorialModel.create(tutorialData);
    return tutorial;
});
const updateTutorial = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorial = yield tutorial_model_1.TutorialModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    return tutorial;
});
const deleteTutorial = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tutorial = yield tutorial_model_1.TutorialModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return tutorial;
});
exports.TutorialServices = {
    getAllTutorials,
    createTutorial,
    updateTutorial,
    deleteTutorial,
};
