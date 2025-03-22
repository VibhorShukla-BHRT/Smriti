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
exports.deleteTask = exports.createTask = exports.getTasks = exports.signup = exports.signin = void 0;
const models_1 = require("../models/models");
const zod_1 = require("../utils/zod");
const auth_1 = require("firebase/auth");
const firebase_1 = require("../utils/firebase");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const parseResult = zod_1.signinSchema.safeParse({ email, password });
    if (!parseResult.success) {
        res.status(400).json({
            success: false,
            msg: "Invalid inputs",
            errors: parseResult.error.errors
        });
        return;
    }
    try {
        const user = yield models_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                msg: "No user found with this email"
            });
            return;
        }
        try {
            yield (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
            req.session.isLoggedIn = true;
            res.status(200).json({
                success: true,
                msg: "Signed in successfully",
                user: { email: user.email, id: user._id }
            });
        }
        catch (firebaseError) {
            res.status(401).json({
                success: false,
                msg: "Authentication failed"
            });
        }
    }
    catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error during sign-in"
        });
    }
});
exports.signin = signin;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const parseResult = zod_1.signupSchema.safeParse({ email, password });
    if (!parseResult.success) {
        res.status(400).json({
            success: false,
            msg: "Invalid inputs",
            errors: parseResult.error.errors
        });
        return;
    }
    try {
        const existingUser = yield models_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                msg: "User with this email already exists"
            });
            return;
        }
        try {
            const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
            const firebaseUser = userCredential.user;
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            const newUser = new models_1.User({
                email,
                password: hashedPassword,
                firebaseUid: firebaseUser.uid
            });
            yield newUser.save();
            req.session.isLoggedIn = true;
            res.status(201).json({
                success: true,
                msg: "Signed up successfully",
                user: { email, id: newUser._id }
            });
        }
        catch (firebaseError) {
            console.error("Firebase signup error:", firebaseError);
            res.status(400).json({
                success: false,
                msg: firebaseError.message || "Error creating account"
            });
        }
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error during sign-up"
        });
    }
});
exports.signup = signup;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, userId } = req.query;
        if (!date) {
            res.status(400).json({
                success: false,
                msg: "Date parameter is required"
            });
            return;
        }
        const query = { date: new Date(date) };
        if (userId) {
            query.userId = userId;
        }
        const tasks = yield models_1.Task.find(query);
        res.status(200).json({
            success: true,
            tasks
        });
    }
    catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({
            success: false,
            msg: "Error retrieving tasks",
            error: error.message
        });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate task data (consider adding a task schema validation)
        if (!req.body.title || !req.body.date) {
            res.status(400).json({
                success: false,
                msg: "Task title and date are required"
            });
            return;
        }
        const task = new models_1.Task(req.body);
        yield task.save();
        res.status(201).json({
            success: true,
            msg: "Task created successfully",
            task
        });
    }
    catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({
            success: false,
            msg: "Error creating task",
            error: error.message
        });
    }
});
exports.createTask = createTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                msg: "Task ID is required"
            });
            return;
        }
        const deletedTask = yield models_1.Task.findByIdAndDelete(id);
        if (!deletedTask) {
            res.status(404).json({
                success: false,
                msg: "Task not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            msg: "Task deleted successfully"
        });
    }
    catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({
            success: false,
            msg: "Error deleting task",
            error: error.message
        });
    }
});
exports.deleteTask = deleteTask;
