import { Router } from "express";
import { middleware } from "../middleware/checkAuth";
import { signup, signin, getTasks, createTask, deleteTask } from "../controllers/user";

const router = Router()

router.post("/user/auth/signup", signup)
router.post("/user/auth/signin", signin)
router.get("/user/gettask",middleware, getTasks)
router.post("/user/createtask",middleware, createTask)
router.delete("/user/deletetask/:taskid",middleware, deleteTask)

export default router