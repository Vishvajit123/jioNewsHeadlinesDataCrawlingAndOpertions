// routes/userRoutes.js

import { Router } from "express";
import { createUser, getUser } from "../controllers/userController.js";


const router = Router();

// Route to creat a new user
router.post("/createUser", createUser);

// Route to Get User by ID
router.get("/:id", getUser);

export default router;