import { Router } from "express";
import { signin, signup, getTasks, deleteTask, createTask } from "../controllers/user";

const router = Router()

router.post("/user/auth/signup", signup)
router.post("/user/auth/signin", signin)
router.post("/user/gettask", getTasks)
router.post("/user/createtask", createTask)
router.post("/user/deletetask", deleteTask)

export default router