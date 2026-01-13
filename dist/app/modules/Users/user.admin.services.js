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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdminServices = void 0;
const user_model_1 = require("../Registration/user.model");
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.UserRegModel.find({ isDeleted: false })
        .select("-password")
        .sort({ createdAt: -1 });
    return users;
});
const updateUserRole = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserRegModel.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select("-password");
    return user;
});
exports.UserAdminServices = {
    getAllUsers,
    updateUserRole,
};
