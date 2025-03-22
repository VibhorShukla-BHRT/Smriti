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
})

const userSchema = new mongoose.Schema({
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
    {type: Number}
  ],
  sosEmail: [
    {type: String}
  ],
  homeAddress: {
    type: String
  }
})
const location = new mongoose.Schema({
  latitude:{
    type: String,
  },
  longitude:{
    type: String
  },
  description:{
    type: String
  }
});
const locationModel = mongoose.model("Locations",location,"Locations")
const Task = mongoose.model('Task', taskSchema)
const User = mongoose.model('User', userSchema)

export { Task, User,locationModel }