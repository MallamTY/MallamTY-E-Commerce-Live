import express from "express";
import CartRoutes from './cart.route';
import FavouriteRoutes from './favourite.route';
import ProductRoutes from './product.route';
import UserRoutes from './user.route';
import AuthRoutes from './auth.route';
import CheckoutRoute from '../route/checkout.route';
import DeliveryRoute from '../route/delivery.route';
import OrderRoute from '../route/order.route';

const router = express.Router();


router.use('/auth', AuthRoutes);
router.use('/cart', CartRoutes);
router.use('/favourite', FavouriteRoutes);
router.use('/product',ProductRoutes);
router.use('/checkout',CheckoutRoute);
router.use('/order', OrderRoute);
router.use(UserRoutes);
router.use('/auth', DeliveryRoute);

export default router;

