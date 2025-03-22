import { Request, Response } from "express";
import { Task, User } from "../models/models";
import { signinSchema, signupSchema } from "../utils/zod";
import bcrypt from "bcrypt";

const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const parseResult = signinSchema.safeParse({ email, password });
  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      msg: "Invalid inputs",
      errors: parseResult.error.errors
    });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        msg: "No user found with this email"
      });
      return;
    }

    // Compare hashed password with provided password
    if(user.password) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({
          success: false,
          msg: "Invalid credentials"
        });
        return;
      }
    }

    // Set session data
    const token = JSON.stringify(user._id);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    });
    // req.session.userId = JSON.stringify(user._id);
    
    res.status(200).json({
      success: true,
      msg: "Signed in successfully",
      user: { email: user.email, id: user._id }
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error during sign-in"
    });
  }
};

const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const parseResult = signupSchema.safeParse({ name, email, password });
  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      msg: "Invalid inputs",
      errors: parseResult.error.errors
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        msg: "User with this email already exists"
      });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name, 
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    
    const token = JSON.stringify(newUser._id);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.status(201).json({
      success: true,
      msg: "Signed up successfully",
      user: { email, id: newUser._id }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error during sign-up",
      error: error
    });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          msg: "Failed to logout"
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        msg: "Logged out successfully"
      });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error during logout"
    });
  }
};

const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.query;

    if (!date) {
      res.status(400).json({
        success: false,
        msg: "Date parameter is required"
      });
      return;
    }
    const tasks = await Task.find({ date });
    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error: any) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      msg: "Error retrieving tasks",
      error: error.message
    });
  }
};

const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate task data (consider adding a task schema validation)
    if (!req.body.title || !req.body.date) {
      res.status(400).json({
        success: false,
        msg: "Task title and date are required"
      });
      return;
    }

    const task = new Task(req.body);
    await task.save();

    res.status(201).json({
      success: true,
      msg: "Task created successfully",
      task
    });
  } catch (error: any) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      msg: "Error creating task",
      error: error.message
    });
  }
};

const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskid } = req.params;
    if (!taskid) {
      res.status(400).json({
        success: false,
        msg: "Task ID is required"
      });
      return;
    }

    const deletedTask = await Task.findByIdAndDelete(taskid);
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
  } catch (error: any) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      msg: "Error deleting task",
      error: error.message
    });
  }
};

export {
  signin,
  signup,
  logout,
  getTasks,
  createTask,
  deleteTask
};