import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";


const buyerAuth: RequestHandler = (req, res, next) => {
    
    try {
        const currentUser = req.user;
        if (!currentUser.role) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: 'Failed !!!!!!!!',
                message: 'Unauthorized access'
            })
        }
    
        if (currentUser.role !== 'user') {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: 'Failed !!!!!!!!',
                message: 'Unauthorized access'
            })
        }

        next();
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: `Failed !!!!!!!!!!!!`,
            message: error.message
    })
    } 
}


export default buyerAuth;