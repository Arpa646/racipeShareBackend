"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/Registration/user.route");
const premium_route_1 = require("../modules/Premium/premium.route");
const recipie_route_1 = require("../modules/Recipie/recipie.route");
const router = express_1.default.Router();
const modulerRoutes = [
    {
        path: '/auth',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/premium',
        route: premium_route_1.PremiumRoutes,
    },
    {
        path: '/recipies',
        route: recipie_route_1.RecipieRoutes,
    },
];
modulerRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
