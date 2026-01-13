"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./book.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../Registration/user.constant");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), book_controller_1.BookController.createBook);
router.get("/search", book_controller_1.BookController.searchBooks);
router.get("/", book_controller_1.BookController.getAllBooks);
router.get("/:id", book_controller_1.BookController.getSingleBook);
router.put("/:id", book_controller_1.BookController.updateBook);
router.delete("/:id", book_controller_1.BookController.deleteBook);
exports.BookRoutes = router;
