import { Router } from "express";
import { signin, signup, getTasks, deleteTask, createTask } from "../controllers/user";
import { middleware } from "../middleware/checkAuth";

const router = Router()

router.post("/user/auth/signup", middleware, signup)
router.post("/user/auth/signin", middleware, signin)
router.post("/user/gettask", middleware, getTasks)
router.post("/user/createtask", middleware, createTask)
router.post("/user/deletetask", middleware, deleteTask)

export default router