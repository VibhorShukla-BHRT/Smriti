import express, { Request, Response } from 'express';
import { locationModel } from '../models/models';
export const location = async(req: Request, res: Response)=>{
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
}