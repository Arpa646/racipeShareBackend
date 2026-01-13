import express from "express";
import { TutorialController } from "./tutorial.controller";

const router = express.Router();

router.post("/", TutorialController.createTutorial);
router.get("/", TutorialController.getAllTutorials);
router.get("/:id", TutorialController.getSingleTutorial);
router.put("/:id", TutorialController.updateTutorial);
router.delete("/:id", TutorialController.deleteTutorial);

export const TutorialRoutes = router;
