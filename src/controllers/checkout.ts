import Cart from "../model/cart.model";
import { RequestHandler } from "express";
import Product from "../model/product.model";
import Delivery from "../model/doordelivery.model";
import Order from "../model/order.model";
import User from "../model/user.model";
import https from 'https';
import { SECRET_KEY } from "../accessories/configuration";
import { StatusCodes } from "http-status-codes";
const generateUniqueId = require('generate-unique-id');



class CheckoutController {
    constructor() {
    }

    public checkout: RequestHandler = async(req, res, next) => {
        try {
            const {user: {user_id},
                    body: {pickup_station, doordelivery, state, contact_person_name,
                    contact_person_phone, shipping_method, payment_method}
        } = req;
        
        const cart: any = await Cart.findOne({customer: user_id});
        const user: any = await User.findById(user_id);

        if (!(pickup_station || doordelivery)) {
            return res.status(StatusCodes.EXPECTATION_FAILED).json({
                status: `failed`,
                message: `Delivery method must be specified`
            })
        }
        
        if (pickup_station) {
            function deliverFeeCalc(deliveryFees: Array<number>): number {
                return deliveryFees.reduce(function(firstVal, currentVal) {
                    return firstVal + currentVal
                })
                
            }
            
                const productShippingFee: Array<number> = [];
                const productDetails: Array<Array<String>> = [[]]
                
                for (const product of cart.products) {
                    const fetchedProduct: any = await Product.findById(product.product)
                    const totalQuantity = product.totalProductQuantity;
                    const deliveryFee = fetchedProduct?.deliveryfee;
                    const totalDeliveryFee = totalQuantity * deliveryFee;
                    productShippingFee.push(totalDeliveryFee);
                    const productDetail = [];
                    productDetail.push(product.product);
                    productDetail.push(product.totalProductQuantity);
                    productDetails.push(productDetail)
                };
                

                const shippingFee: number = deliverFeeCalc(productShippingFee);
                const order = await Order.create({
                    user: user_id,
                    name: contact_person_name,
                    phone: contact_person_phone,
                    deliverymethod: "Door Delivery",
                    shippingmethod: shipping_method,
                    subtotal: cart.totalPrice,
                    totalPrice: cart.totalPrice + shippingFee,
                    deliveryfee: shippingFee,
                    paymentmethod: payment_method
                }) 
                
                return res.status(StatusCodes.OK).json({
                    status: `success`,
                    order
                })
        }
        else if(doordelivery){
            if (!state) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Delivery address must be specified`
                })
            }
            const firstLetter = state[0].toUpperCase();
            const otherLetters = state.slice(1).toLowerCase();
            const joinStataeString: string = firstLetter+otherLetters;
            const stateDelivery = await Delivery.findOne({state: joinStataeString});
            const deliveryFee: number | undefined = stateDelivery?.deliveryfee;

            
            const productDetails: Array<Array<String>> = [];

            for (const product of cart.products) {
                productDetails.push([product.product, product.totalProductQuantity]);
            };

            const order = await Order.create({
                product: productDetails,
                user: user_id,
                name: contact_person_name,
                phone: contact_person_phone,
                deliverymethod: "Pickup Station",
                shippingmethod: shipping_method,
                subtotal: cart.totalPrice,
                totalPrice: cart.totalPrice +deliveryFee,
                deliveryfee: deliveryFee,
                paymentmethod: payment_method
            });
            const id = generateUniqueId();
            
            const params = JSON.stringify({
                "email": user.email,
                "amount": order.totalPrice * 100,
                "reference": id,
                "callback_url": 'https://medium.com/payment-verify'

            });
            
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/transaction/initialize',
                method: 'POST',
                headers: {
                Authorization: SECRET_KEY,
                'Content-Type': 'application/json'
                }
            }
            const reqpaystack = https.request(options, (respaystack) => {
                let dataStream: any = ''
                respaystack.on('data', (chunk: any) => {
                dataStream += chunk
                });
            
                respaystack.on('end', async() => {
                    const data = JSON.parse(dataStream);
                    
                    order.txref = data.data.reference;
                    await order.save();
                    return res.status(StatusCodes.OK).json({
                        data: JSON.parse(dataStream),
                        order
                    });

                })
            }).on('error', (error: any) => {
                return res.status(StatusCodes.FAILED_DEPENDENCY).json({
                    status: `failed`,
                    message: `An error occurred while trying to get your link`
                })
            })
            
            reqpaystack.write(params)
            reqpaystack.end()
        }
            
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }
    }

    public verifyPayment: RequestHandler = (req, res, next) => {
        try {
            const{query: {txref}} = req;

            const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${txref}`,
            method: 'GET',
            headers: {
                Authorization: SECRET_KEY,
                'Content-Type': 'application/json'
            }
            }

            const reqpaystack = https.request(options, (respaystack: any) => {
            let dataStream= '';

            respaystack.on('data', (chunk: any) => {
                dataStream += chunk
            });

            respaystack.on('end', async() => {
                const data = JSON.parse(dataStream);
                
                if (data.status === false) {
                    return res.status(StatusCodes.PAYMENT_REQUIRED).json({
                        status: `failed`,
                        message: `Incomplete transaction`
                    })
                }
                else if (data.data.status === 'abandoned' && data.status === true) {
                    return res.status(StatusCodes.PAYMENT_REQUIRED).json({
                        status: `pending`,
                        message: `This transaction is currently pending, proceed to make payment`
                    })
                }
                else if (data.data.status === 'success' && data.status === true) {
                    
                    const order: any = await Order.findOne({txref: data.data.reference});
                    for (const product of order.product) {
                        const dbProduct: any = await Product.findById(product[0]);
                        const newQuantity = dbProduct?.quantity - product[1];
                        await Product.findByIdAndUpdate({_id: product[0]}, {quantity: newQuantity});
                    }
                    order.status = 'Processing';
                    order.paidFor = true;
                    order.timePaid = data.data.paidAt;
                    order.paymentmethod = data.data.channel
                    await order.save();

                    return res.status(StatusCodes.OK).json({
                        status: `success`,
                        message: `Payment completed and order in process`,
                        
                    })
                }
            })
            }).on('error', (error: any) => {
            console.error(error)
            });
            reqpaystack.end();
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }
        
    }
}

export default new CheckoutController();