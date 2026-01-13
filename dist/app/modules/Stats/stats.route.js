"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const stats_controller_1 = require("./stats.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.get("/user", (0, auth_1.default)(), stats_controller_1.StatsController.getUserStats);
router.get("/admin", (0, auth_1.default)("admin"), stats_controller_1.StatsController.getAdminStats);
exports.StatsRoutes = router;
