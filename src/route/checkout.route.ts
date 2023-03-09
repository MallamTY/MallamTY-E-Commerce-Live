import express from "express";
import { Middlewares } from "../middlewares";
import { Checkout } from "../controllers";

const router = express.Router();

router.post('/delivery', Middlewares.Authentication, Middlewares.buyerAuth, Checkout.checkout);

router.post('/verify-payment', Middlewares.Authentication, Middlewares.buyerAuth, Checkout.verifyPayment);


export default router;
