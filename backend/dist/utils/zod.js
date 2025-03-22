"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = exports.signinSchema = void 0;
const zod_1 = require("zod");
const signupSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    password: zod_1.z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});
exports.signupSchema = signupSchema;
const signinSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    password: zod_1.z.string()
        .min(1, "Password is required")
});
exports.signinSchema = signinSchema;
