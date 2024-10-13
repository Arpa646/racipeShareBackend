"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        message: data.message,
        success: data.success,
        data: data.data,
    });
};
exports.default = sendResponse;
