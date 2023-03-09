import express, { Router } from "express";
import { Delivery } from "../controllers/index";
import { Middlewares } from "../middlewares";

const router: Router = express.Router();

router.post('/add-delivery', Middlewares.Authentication, Middlewares.adminAuth, Delivery.addDeliveryFee);

router.delete('/remove-delivery/:id', Middlewares.Authentication, Middlewares.adminAuth, Delivery.removeDeliveryFee)

router.put('/update-delivery/:id', Middlewares.Authentication, Middlewares.adminAuth, Delivery.updateDeliveryFee);

export default router; 