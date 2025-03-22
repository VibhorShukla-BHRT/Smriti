"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const middleware = (0, express_1.default)();
exports.middleware = middleware;
middleware.use((0, express_session_1.default)({
    secret: 'S&CR&T',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
middleware.use(express_1.default.json());
middleware.use((req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.status(401).json({ isAuthenticated: false, redirectTo: '/login' });
        return;
    }
    return next();
});
