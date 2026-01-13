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
exports.ReviewController = void 0;
const asynch_1 = __importDefault(require("../../middleware/asynch"));
const response_1 = __importDefault(require("../../utils/response"));
const http_status_codes_1 = require("http-status-codes");
const review_service_1 = require("./review.service");
const createReview = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { bookId, rating, comment } = req.body;
    // Get userId from token (req.user.useremail contains the ObjectId)
    const DEFAULT_USER_ID = "673a0ad83e3e75c0f3804dab";
    let userId;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.useremail) {
        // useremail in token contains the user ObjectId
        userId = req.user.useremail.toString();
        console.log("   ✅ User ID from token:", userId);
        console.log("   📋 Token payload:", JSON.stringify(req.user, null, 2));
    }
    else {
        // Fall back to default if token not present
        userId = DEFAULT_USER_ID;
        console.log("   ⚠️  No token found, using default userId:", userId);
        console.log("   ⚠️  req.user:", JSON.stringify(req.user, null, 2));
    }
    console.log("📝 Review Submission Received:");
    console.log("   User ID:", userId);
    console.log("   Book ID:", bookId);
    console.log("   Rating:", rating);
    console.log("   Comment:", comment || "No comment provided");
    // Validate rating
    if (rating < 1 || rating > 5) {
        console.log("❌ Invalid rating:", rating, "- Must be between 1 and 5");
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Rating must be between 1 and 5",
        });
    }
    const reviewData = {
        userId,
        bookId,
        rating,
        comment,
        status: "pending",
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    console.log("💾 Creating review in database...");
    const result = yield review_service_1.ReviewServices.createReview(reviewData);
    console.log("✅ Review created successfully!");
    console.log("   Review ID:", ((_b = result[0]) === null || _b === void 0 ? void 0 : _b._id) || "N/A");
    console.log("   Status: pending (awaiting approval)");
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Review created successfully",
        data: result,
    });
}));
const getAllReviews = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        let result;
        if (status === "pending" || status === "approved") {
            result = yield review_service_1.ReviewServices.getReviewsByStatus(status);
        }
        else {
            result = yield review_service_1.ReviewServices.getAllReviewsFromDB();
        }
        if (!result || result.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No reviews found",
                data: [],
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Reviews retrieved successfully",
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
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const review = yield review_service_1.ReviewServices.getReviewByIdFromDB(id);
        if (!review) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Review not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Review retrieved successfully",
            data: review,
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
const getReviewsByBook = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    console.log("📚 Getting reviews for book ID:", bookId);
    if (!bookId) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Book ID is required",
        });
    }
    const reviews = yield review_service_1.ReviewServices.getReviewsByBookId(bookId);
    console.log(`✅ Found ${reviews.length} approved reviews for book ${bookId}`);
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: reviews.length > 0
            ? "Reviews retrieved successfully"
            : "No approved reviews found for this book",
        data: reviews,
    });
}));
const getReviewsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const reviews = yield review_service_1.ReviewServices.getReviewsByUserId(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: reviews,
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
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { rating, comment, status } = req.body;
    console.log("🔄 Review Update Request:");
    console.log("   Review ID:", id);
    console.log("   Updates:", { rating, comment, status });
    try {
        if (!id) {
            console.log("❌ Review ID is missing");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Review ID is required"
            });
        }
        if (rating && (rating < 1 || rating > 5)) {
            console.log("❌ Invalid rating:", rating);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }
        const updatedReview = yield review_service_1.ReviewServices.updateReview(id, {
            rating,
            comment,
            status,
        });
        if (!updatedReview) {
            console.log("❌ Review not found with ID:", id);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Review not found"
            });
        }
        console.log("✅ Review updated successfully!");
        console.log("   Review ID:", updatedReview._id);
        if (status)
            console.log("   New Status:", status);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview
        });
    }
    catch (error) {
        console.error("❌ Error updating review:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
const deleteReview = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield review_service_1.ReviewServices.deleteReviewInDB(id);
        if (!result) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Review not found",
                data: null,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Review deleted successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error deleting review",
                error: error.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error deleting review",
                error: "An unexpected error occurred.",
            });
        }
    }
}));
const approveReview = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("✅ Admin approving review:", id);
    try {
        const review = yield review_service_1.ReviewServices.getReviewByIdFromDB(id);
        if (!review) {
            console.log("❌ Review not found:", id);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Review not found",
                data: null,
            });
        }
        if (review.status === "approved") {
            console.log("⚠️  Review already approved:", id);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Review is already approved",
                data: review,
            });
        }
        const updatedReview = yield review_service_1.ReviewServices.updateReview(id, {
            status: "approved",
        });
        console.log("✅ Review approved successfully:", updatedReview === null || updatedReview === void 0 ? void 0 : updatedReview._id);
        (0, response_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Review approved successfully",
            data: updatedReview,
        });
    }
    catch (error) {
        console.error("❌ Error approving review:", error);
        if (error instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error approving review",
                error: error.message,
            });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error approving review",
                error: "An unexpected error occurred.",
            });
        }
    }
}));
exports.ReviewController = {
    createReview,
    getAllReviews,
    getSingleReview,
    getReviewsByBook,
    getReviewsByUser,
    updateReview,
    deleteReview,
    approveReview,
};
