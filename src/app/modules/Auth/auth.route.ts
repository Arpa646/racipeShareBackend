import express from "express";
import { AuthControllers } from "./auth.controller";

import { UserRegModel } from "../Registration/user.model";

const router = express.Router();

router.post(
  "/login",

  AuthControllers.loginUser
);
router.post("/forgot-password", AuthControllers.requestPasswordReset);

// Reset password route
// router.post("/reset-password/:id", AuthControllers.resetPassword);

router.get("/reset-password/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const oldUser = await UserRegModel.findOne({ _id: id });

    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }

    // ইউজার পাওয়া গেছে, পাসওয়ার্ড রিসেট পেজটি রেন্ডার করো
    return res.render("index", {
      email: oldUser.email,
      status: "Not Verified",
    });
  } catch (error) {
    console.log(error);
    return res.send("Error Occurred, Not Verified");
  }
});
router.post("/reset-password/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  console.log(id, password);
  const oldUser = await UserRegModel.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  //const secret = JWT_SECRET + oldUser.password;
  try {
    // const verify = jwt.verify(token, secret);
    //const encryptedPassword = await bcrypt.hash(password, 10);
    await UserRegModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: password,
        },
      }
    );

    res.render("index", { email: oldUser.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});
router.post("/change-password/:id", AuthControllers.ChangePassword); 

export const AuthRoutes = router;
