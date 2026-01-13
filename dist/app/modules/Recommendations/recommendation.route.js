"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const recommendation_controller_1 = require("./recommendation.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
// Get personalized recommendations for authenticated user
router.get("/", (0, auth_1.default)("user", "admin"), recommendation_controller_1.RecommendationController.getRecommendations);
exports.RecommendationRoutes = router;
