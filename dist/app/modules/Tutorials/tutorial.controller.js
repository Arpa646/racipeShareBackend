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
exports.TutorialController = void 0;
const asynch_1 = __importDefault(require("../../middleware/asynch"));
const response_1 = __importDefault(require("../../utils/response"));
const http_status_codes_1 = require("http-status-codes");
const tutorial_service_1 = require("./tutorial.service");
const createTutorial = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, youtubeUrl, category } = req.body;
    const tutorialData = {
        title,
        youtubeUrl,
        category,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = yield tutorial_service_1.TutorialServices.createTutorial(tutorialData);
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Tutorial created successfully",
        data: result,
    });
}));
const getAllTutorials = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield tutorial_service_1.TutorialServices.getAllTutorialsFromDB();
        if (!result || result.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No tutorials found",
                data: [],
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Tutorials retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server error",
                error: err.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Unknown server error",
            });
        }
    }
}));
const getSingleTutorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tutorial = yield tutorial_service_1.TutorialServices.getTutorialByIdFromDB(id);
        if (!tutorial) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Tutorial not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Tutorial retrieved successfully",
            data: tutorial,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server error",
                error: err.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Unknown server error",
            });
        }
    }
});
const updateTutorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, youtubeUrl, category } = req.body;
    try {
        if (!id) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Tutorial ID is required"
            });
        }
        const updatedTutorial = yield tutorial_service_1.TutorialServices.updateTutorial(id, {
            title,
            youtubeUrl,
            category,
        });
        if (!updatedTutorial) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Tutorial not found"
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Tutorial updated successfully",
            data: updatedTutorial
        });
    }
    catch (error) {
        console.error("Error updating tutorial:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
const deleteTutorial = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield tutorial_service_1.TutorialServices.deleteTutorialInDB(id);
        if (!result) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Tutorial not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Tutorial deleted successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error deleting tutorial",
                error: error.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error deleting tutorial",
                error: "An unexpected error occurred.",
            });
        }
    }
}));
exports.TutorialController = {
    createTutorial,
    getAllTutorials,
    getSingleTutorial,
    updateTutorial,
    deleteTutorial,
};
