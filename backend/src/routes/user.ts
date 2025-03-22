import { Router } from "express";
import { signup, signin, getTasks, createTask, deleteTask } from "../controllers/user";

const router = Router()

router.post("/user/auth/signup", signup)
router.post("/user/auth/signin", signin)
router.get("/user/gettask", getTasks)
router.post("/user/createtask", createTask)
router.delete("/user/deletetask/:taskid", deleteTask)

export default router