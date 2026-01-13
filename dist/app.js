"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const intex_1 = __importDefault(require("./app/route/intex"));
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
// Parsers
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Apollo Gears API Service newwwwwwwwwwww',
    });
});
// Application routes
app.use("/api", intex_1.default);
// app.get("/", getAController);
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
