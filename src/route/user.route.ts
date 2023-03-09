import express from "express";
import { User } from "../controllers/index";
import { Middlewares } from "../middlewares";
import { multerUploads } from "../services/multer";

const router = express.Router();

router.post('/register-user', multerUploads, User.registerUser);

router.get('/get-user', Middlewares.Authentication, Middlewares.adminAuth, User.getUser);

router.delete('/delete-user', Middlewares.Authentication, Middlewares.adminAuth, User.deleteUser);

router.get('/get-all-user', Middlewares.Authentication, Middlewares.adminAuth, User.getAllUser);

export default router;