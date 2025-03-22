import express, { Request, Response } from 'express';
import { locationModel } from '../models/models';

const locrouter = express.Router();
locrouter.post("/locations/set-location",async(req: Request, res: Response): Promise<any>=>{
    const {latitude, longitude, description} = req.body;
    const newLocation = new locationModel({
        latitude,
        longitude,
        description
    });
    await newLocation.save();
    return res.status(201).json({
        message:"Location saved"
    });
})
locrouter.get("/locations/get-location",async(req: Request, res: Response): Promise<any>=>{
    const all = await locationModel.find({});
    return res.status(201).json({
        locations: all
    });
})
export default locrouter;