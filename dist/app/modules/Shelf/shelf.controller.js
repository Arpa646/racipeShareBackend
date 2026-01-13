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
exports.ShelfController = void 0;
const asynch_1 = __importDefault(require("../../middleware/asynch"));
const response_1 = __importDefault(require("../../utils/response"));
const http_status_codes_1 = require("http-status-codes");
const shelf_service_1 = require("./shelf.service");
const createShelf = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { bookId, status, progress } = req.body;
    // Get userId from token (req.user.useremail contains the ObjectId)
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.useremail)) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "You are not authorized!",
        });
    }
    const userId = req.user.useremail.toString();
    // Check if shelf entry already exists
    const existingShelf = yield shelf_service_1.ShelfServices.getShelfByUserAndBook(userId, bookId);
    if (existingShelf) {
        // Update existing entry
        const updatedShelf = yield shelf_service_1.ShelfServices.updateShelf(existingShelf._id, {
            status,
            progress,
        });
        return (0, response_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Shelf updated successfully",
            data: updatedShelf,
        });
    }
    const shelfData = {
        userId,
        bookId,
        status,
        progress: progress || 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = yield shelf_service_1.ShelfServices.createShelf(shelfData);
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Book added to shelf successfully",
        data: result,
    });
}));
const getAllShelves = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield shelf_service_1.ShelfServices.getAllShelvesFromDB();
        if (!result || result.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No shelf entries found",
                data: [],
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Shelf entries retrieved successfully",
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
const getSingleShelf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const shelf = yield shelf_service_1.ShelfServices.getShelfByIdFromDB(id);
        if (!shelf) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Shelf entry not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Shelf entry retrieved successfully",
            data: shelf,
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
const getShelvesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get userId from token (req.user.useremail contains the ObjectId)
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.useremail)) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "You are not authorized!",
            });
        }
        const userId = req.user.useremail.toString();
        const shelves = yield shelf_service_1.ShelfServices.getShelvesByUserId(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "User shelf retrieved successfully",
            data: shelves,
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
const getShelvesByBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const shelves = yield shelf_service_1.ShelfServices.getShelvesByBookId(bookId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Book shelf entries retrieved successfully",
            data: shelves,
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
const updateShelf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, progress } = req.body;
    try {
        if (!id) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Shelf ID is required"
            });
        }
        if (progress !== undefined && (progress < 0 || progress > 100)) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Progress must be between 0 and 100",
            });
        }
        const updatedShelf = yield shelf_service_1.ShelfServices.updateShelf(id, {
            status,
            progress,
        });
        if (!updatedShelf) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Shelf entry not found"
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Shelf updated successfully",
            data: updatedShelf
        });
    }
    catch (error) {
        console.error("Error updating shelf:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
const deleteShelf = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield shelf_service_1.ShelfServices.deleteShelfInDB(id);
        if (!result) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Shelf entry not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Book removed from shelf successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error deleting shelf entry",
                error: error.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error deleting shelf entry",
                error: "An unexpected error occurred.",
            });
        }
    }
}));
exports.ShelfController = {
    createShelf,
    getAllShelves,
    getSingleShelf,
    getShelvesByUser,
    getShelvesByBook,
    updateShelf,
    deleteShelf,
};
