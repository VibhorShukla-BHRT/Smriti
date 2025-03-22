"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    time: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    sosContacts: [
        { type: Number }
    ],
    sosEmail: [
        { type: String }
    ],
    homeAddress: {
        type: String
    }
});
const Task = mongoose_1.default.model('Task', taskSchema);
exports.Task = Task;
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
