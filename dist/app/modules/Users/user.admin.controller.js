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
exports.UserAdminController = void 0;
const asynch_1 = __importDefault(require("../../middleware/asynch"));
const response_1 = __importDefault(require("../../utils/response"));
const user_admin_services_1 = require("./user.admin.services");
const http_status_codes_1 = require("http-status-codes");
const getAllUsers = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_admin_services_1.UserAdminServices.getAllUsers();
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
}));
const updateUserRole = (0, asynch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["admin", "user"].includes(role)) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid role. Must be 'admin' or 'user'",
        });
    }
    const result = yield user_admin_services_1.UserAdminServices.updateUserRole(id, role);
    if (!result) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    }
    (0, response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User role updated successfully",
        data: result,
    });
}));
exports.UserAdminController = {
    getAllUsers,
    updateUserRole,
};
