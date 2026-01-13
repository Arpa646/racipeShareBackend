"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreRoutes = void 0;
const express_1 = __importDefault(require("express"));
const genre_controller_1 = require("./genre.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../Registration/user.constant");
const router = express_1.default.Router();
// Admin only routes
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), genre_controller_1.GenreController.createGenre);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), genre_controller_1.GenreController.updateGenre);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), genre_controller_1.GenreController.deleteGenre);
// Public routes (anyone can view genres)
router.get("/", genre_controller_1.GenreController.getAllGenres);
router.get("/:id", genre_controller_1.GenreController.getSingleGenre);
exports.GenreRoutes = router;
