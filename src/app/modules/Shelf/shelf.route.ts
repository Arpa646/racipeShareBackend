import express from "express";
import { ShelfController } from "./shelf.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(), ShelfController.createShelf);
router.get("/", ShelfController.getAllShelves);
router.get("/user", auth(), ShelfController.getShelvesByUser);
router.get("/book/:bookId", ShelfController.getShelvesByBook);
router.get("/:id", ShelfController.getSingleShelf);
router.put("/:id", ShelfController.updateShelf);
router.delete("/:id", ShelfController.deleteShelf);

export const ShelfRoutes = router;
