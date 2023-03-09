import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Order from "../model/order.model";

class OrderController {
    constructor() {
        
    }
    public updateOrder: RequestHandler = async(req, res, next) => {
        try {
            const {body: {order_id, status, reference, }} = req;

            const order = await Order.findOneAndUpdate({$or: [{_id: order_id}, {txref: reference}]},
                                                        {...req.body}, {new: true}
                                                );
            if(!order) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: `failed`,
                    message: `Order not found`,
                })
            }

            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Order updated`,
                order
            })
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`, 
                messgae: error.message
            })
        }
    }

    public getSingleOrder: RequestHandler = async(req, res, next) => {
    try {
        const {body: {order_id, reference}} = req;
        
        if (!order_id && !reference ) {
            return res.status(404).json({
                status: `failed`, 
                messgae: `You need to specify the filtering paramter`
            })
        }
        const order = await Order.findOne({$or: [{_id: order_id}, {txref: reference}, {...req.body}]})
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: `failed`,
                message: `Order not found`,
                order
            })
        }

        return res.status(StatusCodes.OK).json({
            status: `success`,
            message: `Search completed`,
            order
        })
    } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`, 
                messgae: error.message
            })
        }
    }


    public getAllOrder: RequestHandler = async(req, res, next) => {
        try {
    
        const order = await Order.find()
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: `failed`,
                message: `Order not found`,
                order
            })
        }
    
        return res.status(StatusCodes.OK).json({
            status: `success`,
            message: `Search completed`,
            order
        })
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`, 
                messgae: error.message
            })
        }
    }

    public deleteOrder: RequestHandler = async(req, res, next) => {
        try {
            
            const {body: {order_id, reference}} = req;

            if (!order_id && !reference) {
                return res.status(404).json({
                    status: `failed`, 
                    messgae: `You need to specify the filtering paramter`
                })
            }
            const deletedOrder = await Order.findOneAndDelete({$or: [{_id: order_id}, {txref: reference}, {...req.body}]});
            if (!deletedOrder) {
                return res.status(404).json({
                    status: `failed`, 
                    messgae: `Unable to delete the order this time`,
                })
            }

            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Order deleted`
            })
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`, 
                messgae: error.message
            })
        }
    }
 
}

export default new OrderController();