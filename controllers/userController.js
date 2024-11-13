// controllers/userController.js
import { User } from '../models/userModel.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logError } from '../utils/commanError.js';

// Controller function to create a new user
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists by email or username
  const existingUser = await User.findOne({ email });
  // If a user with the given email is found
  if (existingUser) {
    // return res.status(400).json({ message: 'User already exists' });
    return sendResponse(res, 400, "User Already exist",existingUser);
  }

  //if not Create a new User
  const newUser = new User({ username, email, password });

  try {
    await newUser.save(); // Save the new user to the database
    // res.status(201).json({ message: 'User created successfully', user: newUser });
    return sendResponse(res, 201, "User Created Successfully", newUser);
  } catch (error) {
    // res.status(500).json({ message: 'Error creating user', error });
    logError(error);
    return sendResponse(res, 500, "Error in Creating User", error.message)
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
      // return res.status(404).json({ message: 'User not found' });
      return sendResponse(res, 404, "User Not Found");
    }
    // If user is found, respond with user details
    // res.status(200).json(user);
    return sendResponse(res, 200, "User Found" ,user);
  } catch (error) { 
    // Handle errors during user retrieval procc
    logError(error);
    // res.status(500).json({ message: 'Error fetching user', error });
    return sendResponse(res, 500, "Error in Fetching User" , error.message);
  }
};
