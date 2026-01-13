import express from "express";
import { RecommendationController } from "./recommendation.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// Get personalized recommendations for authenticated user
router.get("/", auth("user", "admin"), RecommendationController.getRecommendations);

export const RecommendationRoutes = router;
