import express from "express";
import { Auth } from "../controllers/index";
import { Middlewares } from "../middlewares";
import { multerUploads } from "../services/multer";

const router = express.Router();

router.post('/login', Auth.logIn);

router.put('/verify-email/:token', Auth.verifyEmail);

router.post('/resend-otp/:user_id', Auth.resendOTP);

router.post('/verify-otp/:user_id', Auth.verifyOTP);

router.post('/forget-password', Auth.forgetPassword);

router.put('/reset-password/:token', Auth.resetPassword);

router.put('/update-profile', Middlewares.Authentication, Auth.updateUserProfile);

router.put('/update-profile-picture', Middlewares.Authentication, multerUploads, Auth.updateProfilePicture);


export default router;
