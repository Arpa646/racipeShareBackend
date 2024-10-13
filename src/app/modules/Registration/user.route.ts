import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";
import uservalidateSchema from "./user.validation";
import validatereq from "../../middleware/validateroute";

const router = express.Router();

router.post(
  "/signup",

  userControllers.createUser
);
router.get("/", userControllers.getAllUser);


router.post("/follow", userControllers.followUser);
router.post("/unfollow", userControllers.unfollowUser);



router.put("/updateprofile/:id", userControllers.updateProfile);
router.get("/:id", userControllers.getSingleUser);
router.delete("/:id", userControllers.deleteUser);
router.put("/change-block/:id",userControllers.updateUserStates);
export const UserRoutes = router;
