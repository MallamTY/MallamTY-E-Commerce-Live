import  express from "express";
import { Product } from "../controllers/index";
import { Middlewares } from "../middlewares";
import { multiMulterUploads } from "../services/multer";


const router = express.Router();

router.post('/upload', Middlewares.Authentication , Middlewares.vendorAuth, multiMulterUploads, Product.uploadProduct)

router.delete('/delete/:id', Middlewares.Authentication, Middlewares.adminAuth, Product.deleteProduct);

router.put('/update/:id', multiMulterUploads, Product.updateProduct);

router.get('/get-single', Middlewares.Authentication, Product.getProduct);

router.get('/get-all', Middlewares.Authentication, Product.getAllProduct)

export default router; 