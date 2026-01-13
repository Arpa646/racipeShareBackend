"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../Registration/user.constant");
const router = express_1.default.Router();
// Middleware to conditionally require admin for pending status
const conditionalAdminAuth = (req, res, next) => {
    if (req.query.status === "pending") {
        const adminAuth = (0, auth_1.default)(user_constant_1.USER_ROLE.admin);
        return adminAuth(req, res, next);
    }
    next();
};
router.post("/", review_controller_1.ReviewController.createReview);
router.get("/", conditionalAdminAuth, review_controller_1.ReviewController.getAllReviews);
router.get("/book/:bookId", review_controller_1.ReviewController.getReviewsByBook);
router.get("/user/:userId", review_controller_1.ReviewController.getReviewsByUser);
router.get("/:id", review_controller_1.ReviewController.getSingleReview);
router.put("/:id", review_controller_1.ReviewController.updateReview);
router.patch("/:id/approve", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), review_controller_1.ReviewController.approveReview);
router.delete("/:id", review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes = router;
