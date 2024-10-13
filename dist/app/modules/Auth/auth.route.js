"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const user_model_1 = require("../Registration/user.model");
const router = express_1.default.Router();
router.post("/login", auth_controller_1.AuthControllers.loginUser);
router.post("/forgot-password", auth_controller_1.AuthControllers.requestPasswordReset);
// Reset password route
// router.post("/reset-password/:id", AuthControllers.resetPassword);
router.get("/reset-password/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const oldUser = yield user_model_1.UserRegModel.findOne({ _id: id });
        if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
        }
        // ইউজার পাওয়া গেছে, পাসওয়ার্ড রিসেট পেজটি রেন্ডার করো
        return res.render("index", {
            email: oldUser.email,
            status: "Not Verified",
        });
    }
    catch (error) {
        console.log(error);
        return res.send("Error Occurred, Not Verified");
    }
}));
router.post("/reset-password/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password } = req.body;
    console.log(id, password);
    const oldUser = yield user_model_1.UserRegModel.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    //const secret = JWT_SECRET + oldUser.password;
    try {
        // const verify = jwt.verify(token, secret);
        //const encryptedPassword = await bcrypt.hash(password, 10);
        yield user_model_1.UserRegModel.updateOne({
            _id: id,
        }, {
            $set: {
                password: password,
            },
        });
        res.render("index", { email: oldUser.email, status: "verified" });
    }
    catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
    }
}));
router.post("/change-password/:id", auth_controller_1.AuthControllers.ChangePassword);
exports.AuthRoutes = router;
