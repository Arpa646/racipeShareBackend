"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_admin_controller_1 = require("./user.admin.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("admin"), user_admin_controller_1.UserAdminController.getAllUsers);
router.put("/:id/role", (0, auth_1.default)("admin"), user_admin_controller_1.UserAdminController.updateUserRole);
exports.UserAdminRoutes = router;
