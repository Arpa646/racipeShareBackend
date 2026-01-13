"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShelfRoutes = void 0;
const express_1 = __importDefault(require("express"));
const shelf_controller_1 = require("./shelf.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), shelf_controller_1.ShelfController.createShelf);
router.get("/", shelf_controller_1.ShelfController.getAllShelves);
router.get("/user", (0, auth_1.default)(), shelf_controller_1.ShelfController.getShelvesByUser);
router.get("/book/:bookId", shelf_controller_1.ShelfController.getShelvesByBook);
router.get("/:id", shelf_controller_1.ShelfController.getSingleShelf);
router.put("/:id", shelf_controller_1.ShelfController.updateShelf);
router.delete("/:id", shelf_controller_1.ShelfController.deleteShelf);
exports.ShelfRoutes = router;
