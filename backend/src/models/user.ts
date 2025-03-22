import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {

  },
  email: {

  },
  password: {

  },
  age: {

  },
  gender: {

  },
  sosContacts: {

  },
  sosEmails: {

  },
  homeAddress: {

  },
});

export const User = mongoose.model('User', taskSchema);