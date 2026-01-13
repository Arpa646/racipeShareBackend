import express from "express";
import { GenreController } from "./genre.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../Registration/user.constant";

const router = express.Router();

// Admin only routes
router.post("/", auth(USER_ROLE.admin), GenreController.createGenre);
router.put("/:id", auth(USER_ROLE.admin), GenreController.updateGenre);
router.delete("/:id", auth(USER_ROLE.admin), GenreController.deleteGenre);

// Public routes (anyone can view genres)
router.get("/", GenreController.getAllGenres);
router.get("/:id", GenreController.getSingleGenre);

export const GenreRoutes = router;
