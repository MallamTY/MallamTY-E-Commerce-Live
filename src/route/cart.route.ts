import express, { Router } from "express";
import { Cart } from "../controllers/index";
import { Middlewares } from "../middlewares";

const router: Router = express.Router();



router.post('/add', Middlewares.Authentication, Middlewares.buyerAuth, Cart.cartProduct);

 router.post('/decrease-one', Middlewares.Authentication, Middlewares.buyerAuth, Cart.decreaseCartByOne);

router.delete('/delete', Middlewares.Authentication, Middlewares.buyerAuth, Cart.deleteCart);

 router.post('/increase-one', Middlewares.Authentication, Middlewares.buyerAuth, Cart.increaseCartByOne);

router.get('/get-product', Middlewares.Authentication, Middlewares.buyerAuth, Cart.getCartedProduct);

router.delete('/delete-product', Middlewares.Authentication, Middlewares.buyerAuth, Cart.deleteProductFromCart);



export default router;
