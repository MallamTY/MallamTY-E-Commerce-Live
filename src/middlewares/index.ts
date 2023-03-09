import Authentication from "./auth";
import adminAuth from "./verifyAdmin";
import buyerAuth from "./verifyUser";
import vendorAuth from "./verifyVendor";


export const Middlewares = {
    Authentication,
    buyerAuth,
    adminAuth,
    vendorAuth
}