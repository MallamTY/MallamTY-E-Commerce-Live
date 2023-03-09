import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Favourite from "../model/favourites.model";
import Product from "../model/product.model";

class FavouriteController {
    constructor() {
        
    }



    public addOrRemoveProductToFavourite: RequestHandler = async(req, res, next) => {
        try {
            let requestVal: {
                product_id: string,
                user_id: string;
            }

            const {user: {user_id}, 
                    body: {product_id}
            } = req;
            
            const product = await Product.findById(product_id)
            const favourites: object | any = await Favourite.findOne({customer: user_id})
            
            if(!favourites) {
                const newFavourites = await Favourite.create({customer: user_id, products: product_id})

                return res.status(StatusCodes.CREATED).json({
                    status: `success`,
                    message: `${product?.name} has been added to your favourite products`,
                    favourite: newFavourites
                }); 
            }
            else if (favourites.products.includes(product_id) && favourites.products.length === 1) {
                await Favourite.findOneAndRemove({customer: user_id})
                return res.status(StatusCodes.OK).json({
                    status: `success`,
                    message: `${product?.name} has been removed from your favourite products`,
                    favourites
                }); 
            }
            
            else if(!favourites.products.includes(product_id) && favourites.products.length !== 0) {
                
                favourites.products.push(product_id);
                favourites.save()
                return res.status(StatusCodes.OK).json({
                    status: `success`,
                    message: `${product?.name} has been added to your favourite products`,
                    favourites
                }); 
            }
            else if (favourites.products.includes(product_id) && favourites.products.length > 1) {
            
                for (const productId of favourites.products) {
                        if (productId.toString() === product_id) {
                            const productIndex = favourites.products.indexOf(productId);
                            favourites.products.splice(productIndex, 1);

                            await favourites.save()
                            return res.status(StatusCodes.OK).json({
                                status: `success`,
                                message: `${product?.name} has been added to your favourite products`,
                                favourites
                            });  
                        }
                        
                    }
                    
                }

                else{
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: `failed`,
                        message: `An error was encountered`
                    })
                }
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                error: error.message
            })
        }

    }

    public getFavourite: RequestHandler = async(req, res, next) => {
        try {
            let requestVal: {
                user_id: string
            };

            const {user: {user_id}
                } = req;

            const favourite = await Favourite.find({customer: user_id});
            if (favourite.length === 0) {
                return res.status(StatusCodes.OK).json({
                    status: `failed`,
                    message: `You don't have any product in your favourites list`
                }); 
            }
            
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Your favourites list has successfully been obtained`,
                favourite
            }); 
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'failed',
                message: error.message
            })
        }

    }

    public checkProductFromFavourite: RequestHandler = async(req, res, next) => {
        try {
                const {user: {user_id},
                body: {product_id}
                } = req;

            const prodInFavourite = await Favourite.findOne({customer: user_id});
            

            if(!prodInFavourite) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: `failed`,
                    message: `You don't have any favourite list`
                }); 
            }
            const product: any = await Product.findById(product_id);
            
            if(!prodInFavourite?.products.includes(product_id)) {

            return res.status(StatusCodes.BAD_REQUEST).json({
                status: `failed`,
                message: `${product.name} is not on your favourites list`
            }); 
            }


            return res.status(StatusCodes.OK).json({
            status: `success`,
            message: `${product.name} found on your favourites list`,
            
            }); 
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }
    }

    public deleteFavourite: RequestHandler = async(req, res, next) => {
        try {
            
            const {user: {user_id}
                } = req;

        const deletedFavourite = await Favourite.findOneAndDelete({customer: user_id});
                
        if(!deletedFavourite) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: `failed`,
                message: `Your favourite list is empty !!!`
            }); 
        }

        return res.status(StatusCodes.OK).json({
            status: `success`,
            message: `Your favourites list has been cleared`
            }); 
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'failed',
                message: error.message
            })
        }
    }

}

export default new FavouriteController();