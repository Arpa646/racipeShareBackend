import express from "express";
//import { userControllers } from "./user.controller";

// import { facilityController } from "./facility.controller";


import { premiumController } from "./premium.controller";

const router = express.Router();

router.post("/", premiumController.makePremUser);
router.get("/success", premiumController.confirmation);



export const PremiumRoutes = router;
