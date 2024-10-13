"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumRoutes = void 0;
const express_1 = __importDefault(require("express"));
//import { userControllers } from "./user.controller";
// import { facilityController } from "./facility.controller";
const premium_controller_1 = require("./premium.controller");
const router = express_1.default.Router();
router.post("/", premium_controller_1.premiumController.makePremUser);
router.get("/success", premium_controller_1.premiumController.confirmation);
exports.PremiumRoutes = router;
