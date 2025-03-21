import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
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

export const Task = mongoose.model('Task', taskSchema);