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
exports.RecommendationController = void 0;
const asynch_1 = __importDefault(require("../../middleware/asynch"));
const response_1 = __importDefault(require("../../utils/response"));
const http_status_codes_1 = require("http-status-codes");
const recommendation_service_1 = require("./recommendation.service");
/**
 * Get personalized book recommendations for the authenticated user
 * GET /api/recommendations
 */
const getRecommendations = (0, asynch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get userId from token (req.user.useremail contains the ObjectId)
    const DEFAULT_USER_ID = "673a0ad83e3e75c0f3804dab";
    let userId;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.useremail) {
        // useremail in token contains the user ObjectId
        userId = req.user.useremail.toString();
        console.log("✅ User ID from token:", userId);
    }
    else {
        // Fall back to default if token not present
        userId = DEFAULT_USER_ID;
        console.log("⚠️  No token found, using default userId:", userId);
    }
    const result = yield recommendation_service_1.RecommendationServices.getPersonalizedRecommendations(userId);
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.fallbackUsed
            ? "Popular book recommendations (limited reading history)"
            : "Personalized recommendations retrieved successfully",
        data: result,
    });
}));
exports.RecommendationController = {
    getRecommendations,
};
