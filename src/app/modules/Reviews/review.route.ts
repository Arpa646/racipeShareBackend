import express, { Request, Response, NextFunction } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../Registration/user.constant";

const router = express.Router();

// Middleware to conditionally require admin for pending status
const conditionalAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.status === "pending") {
    const adminAuth = auth(USER_ROLE.admin);
    return adminAuth(req, res, next);
  }
  next();
};

router.post("/", ReviewController.createReview);
router.get("/", conditionalAdminAuth, ReviewController.getAllReviews);
router.get("/book/:bookId", ReviewController.getReviewsByBook);
router.get("/user/:userId", ReviewController.getReviewsByUser);
router.get("/:id", ReviewController.getSingleReview);
router.put("/:id", ReviewController.updateReview);
router.patch("/:id/approve", auth(USER_ROLE.admin), ReviewController.approveReview);
router.delete("/:id", ReviewController.deleteReview);

export const ReviewRoutes = router;
