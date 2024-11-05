// controllers/userController.js
import { User } from '../models/userModel.js';

// Controller function to create a new user
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists by email or username
  const existingUser = await User.findOne({ email });
  // If a user with the given email is found
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  //if not Create a new User
  const newUser = new User({ username, email, password });

  try {
    await newUser.save(); // Save the new user to the database
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Controller function to fetch a user by ID
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID in the database
    const user = await User.findById(id);
    // If no user is found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // If user is found, respond with user details
    res.status(200).json(user);
  } catch (error) { 
    // Handle errors during user retrieval procc
    res.status(500).json({ message: 'Error fetching user', error });
  }
};
