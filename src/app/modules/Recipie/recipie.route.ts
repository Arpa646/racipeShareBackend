import express from "express";

import { RecipieController } from "./recipie.controller";

const router = express.Router();

router.post("/", RecipieController.createRecipie);
router.get("/", RecipieController.getAllRacipie);

// router.get("/", facilityController.getAllFacility);
router.put("/:id", RecipieController.updateRecipieStates);
router.post("/comment", RecipieController.addComment);
router.delete("/deletecomment/:id", RecipieController.deleteComment);
router.post("/rating", RecipieController.postRating);

router.put("/update/:id", RecipieController.updateRecipeController);

router.post("/like", RecipieController.likeRecipe);
router.post("/dislike", RecipieController.dislikeRecipe);

router.delete("/:id", RecipieController.deleteRecipe);
router.get("/:id", RecipieController.getSingleRecipe);
router.get("/", RecipieController.getSingleRecipeByEmail);
export const RecipieRoutes = router;
