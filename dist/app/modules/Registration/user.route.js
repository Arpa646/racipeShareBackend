"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.post("/signup", user_controller_1.userControllers.createUser);
router.get("/", user_controller_1.userControllers.getAllUser);
router.post("/follow", user_controller_1.userControllers.followUser);
router.post("/unfollow", user_controller_1.userControllers.unfollowUser);
router.put("/updateprofile/:id", user_controller_1.userControllers.updateProfile);
router.get("/:id", user_controller_1.userControllers.getSingleUser);
router.delete("/:id", user_controller_1.userControllers.deleteUser);
router.put("/change-block/:id", user_controller_1.userControllers.updateUserStates);
exports.UserRoutes = router;
