import express from "express";
import { BookController } from "./book.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../Registration/user.constant";

const router = express.Router();

router.post("/", auth(USER_ROLE.user, USER_ROLE.admin), BookController.createBook);
router.get("/search", BookController.searchBooks);
router.get("/", BookController.getAllBooks);
router.get("/:id", BookController.getSingleBook);
router.put("/:id", BookController.updateBook);
router.delete("/:id", BookController.deleteBook);

export const BookRoutes = router;
