import { json } from "body-parser";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const  adminAuth: RequestHandler = (req, res, next) => {
    try {
        const currentUser = req.user;
        
    if (!currentUser) {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: 'Failed !!!!!!',
            message: 'Unauthorized access'
        })
    }

    if (currentUser.role !== 'admin') {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: 'Failed !!!!!!',
            message: 'Unauthorized access'
        })
    }
    next()
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
        })
    }
}

export default adminAuth;

