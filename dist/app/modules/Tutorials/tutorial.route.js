"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorialRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tutorial_controller_1 = require("./tutorial.controller");
const router = express_1.default.Router();
router.post("/", tutorial_controller_1.TutorialController.createTutorial);
router.get("/", tutorial_controller_1.TutorialController.getAllTutorials);
router.get("/:id", tutorial_controller_1.TutorialController.getSingleTutorial);
router.put("/:id", tutorial_controller_1.TutorialController.updateTutorial);
router.delete("/:id", tutorial_controller_1.TutorialController.deleteTutorial);
exports.TutorialRoutes = router;
