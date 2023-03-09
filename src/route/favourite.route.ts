import express from "express";
import { Middlewares } from "../middlewares";
import { Favourite } from "../controllers/index";


const router = express.Router();

router.post('/add-or-remove', Middlewares.Authentication,Middlewares.buyerAuth, Favourite.addOrRemoveProductToFavourite);

router.delete('/delete', Middlewares.Authentication, Middlewares.buyerAuth, Favourite.deleteFavourite);

router.get('/get', Middlewares.Authentication, Middlewares.buyerAuth, Favourite.getFavourite);

router.get('/check-product', Middlewares.Authentication, Middlewares.buyerAuth, Favourite.checkProductFromFavourite);

export default router