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
exports.AuthServices = void 0;
const user_model_1 = require("../Registration/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// JWT secret for tokens
const JWT_SECRET = "your_secret_key";
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.UserRegModel.findOne({
        email: payload.email,
        password: payload.password
    });
    if (!user) {
        throw new Error("This user is not found!");
    }
    // checking if the user is already deleted
    //const isDeleted = user?.isDeleted;
    const isDeleted = user === null || user === void 0 ? void 0 : user.$isDeleted();
    if (isDeleted) {
        throw new Error("This user is not found!");
    }
    //checking if the password is correct
    const isPasswordMatched = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    //create token and sent to the  client
    const jwtPayload = {
        userId: user.email,
        useremail: user._id,
        role: user.role,
    };
    console.log('for create token', jwtPayload);
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, "jjjnn", {
        expiresIn: "10d",
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, "production", {
        expiresIn: "365d",
    });
    return [accessToken, user, refreshToken];
});
// Password Reset Request - Send Email with Reset Link
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserRegModel.findOne({ email });
    if (!user) {
        throw new Error("User not found!");
    }
    // Create JWT reset token
    const secret = JWT_SECRET + user.password;
    const token = jsonwebtoken_1.default.sign({ email: user.email, id: user._id }, secret, { expiresIn: "5m" });
    const link = `http://localhost:5000/api/auth/reset-password/${user._id}`;
    // Send Email
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "arpakhan114@gmail.com",
            pass: "ycvc oevf bofa itrf",
        },
    });
    transporter.sendMail({
        from: 'arpakhan114@gmail.com',
        to: email,
        subject: 'Test Email',
        text: link
    }, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
    // console.log(transporter)
    // const mailOptions = {
    //   from: "arpakhan114@gmail.com",
    //   to: email,
    //   subject: "Password Reset",
    //   text: `Click the link to reset your password: ${link}`,
    // };
    //await transporter.sendMail(mailOptions);
    return link;
});
// Reset Password with Token
const changePass = (id, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserRegModel.findById(id);
    if (!user) {
        throw new Error("User not found!");
    }
    try {
        // Verify the token
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update the user's password
        yield user_model_1.UserRegModel.updateOne({ _id: id }, { password: newPassword });
        return "Password has been reset successfully";
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
});
exports.AuthServices = {
    loginUser,
    requestPasswordReset,
    changePass
    // resetPassword,
};
