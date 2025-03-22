import { Request, Response } from "express";
import { Task, User } from "../models/models";
import { signinSchema, signupSchema } from "../utils/zod";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";
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

    try {
      await signInWithEmailAndPassword(auth, email, password)
      req.session.isLoggedIn = true
      res.status(200).json({
        success: true,
        msg: "Signed in successfully",
        user: { email: user.email, id: user._id }
      });
    } catch (firebaseError) {
      res.status(401).json({
        success: false,
        msg: "Authentication failed"
      });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error during sign-in"
    });
  }
};


const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  const parseResult = signupSchema.safeParse({ email, password });
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
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const newUser = new User({
        email,
        password: hashedPassword,
        firebaseUid: firebaseUser.uid
      });
      await newUser.save();
      req.session.isLoggedIn = true
      res.status(201).json({
        success: true,
        msg: "Signed up successfully",
        user: { email, id: newUser._id }
      });
    } catch (firebaseError: any) {
      console.error("Firebase signup error:", firebaseError);
      res.status(400).json({
        success: false,
        msg: firebaseError.message || "Error creating account"
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error during sign-up"
    });
  }
};


const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, userId } = req.query;
    
    if (!date) {
      res.status(400).json({
        success: false,
        msg: "Date parameter is required"
      });
      return;
    }
    
    const query: any = { date: new Date(date as string) };
    if (userId) {
      query.userId = userId;
    }
    
    const tasks = await Task.find(query);
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
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        msg: "Task ID is required"
      });
      return;
    }
    
    const deletedTask = await Task.findByIdAndDelete(id);
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
  getTasks, 
  createTask, 
  deleteTask 
};