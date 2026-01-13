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
const book_route_1 = require("../modules/Books/book.route");
const genre_route_1 = require("../modules/Genres/genre.route");
const review_route_1 = require("../modules/Reviews/review.route");
const shelf_route_1 = require("../modules/Shelf/shelf.route");
const tutorial_route_1 = require("../modules/Tutorials/tutorial.route");
const recommendation_route_1 = require("../modules/Recommendations/recommendation.route");
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
    {
        path: '/books',
        route: book_route_1.BookRoutes,
    },
    {
        path: '/genres',
        route: genre_route_1.GenreRoutes,
    },
    {
        path: '/reviews',
        route: review_route_1.ReviewRoutes,
    },
    {
        path: '/shelf',
        route: shelf_route_1.ShelfRoutes,
    },
    {
        path: '/tutorials',
        route: tutorial_route_1.TutorialRoutes,
    },
    {
        path: '/recommendations',
        route: recommendation_route_1.RecommendationRoutes,
    },
];
modulerRoutes.forEach(route => {
    router.use(route.path, route.route);
    console.log(`Route registered: ${route.path}`);
});
exports.default = router;
