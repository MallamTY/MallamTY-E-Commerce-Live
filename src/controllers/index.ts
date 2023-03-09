import CheckoutController from './checkout';

const checkout = CheckoutController.checkout;
const verifyPayment = CheckoutController.verifyPayment;

import DeliveryController from './deliveryController';

const addDeliveryFee = DeliveryController.addDeliveryFee
const removeDeliveryFee = DeliveryController.removeDeliveryFee;
const updateDeliveryFee = DeliveryController.updateDeliveryFee;


import OrderController from "./orderController";

const updateOrder = OrderController.updateOrder;
const getAllOrder = OrderController.getAllOrder;
const getSingleOrder = OrderController.getSingleOrder;
const deleteOrder = OrderController.deleteOrder;


import AuthController from "./authController";

const logIn = AuthController.logIn;
const verifyEmail = AuthController.verifyEmail;
const resendEmailVerificiationLink = AuthController.resendEmailVerificiationLink;
const verifyOTP = AuthController.verifyOTP;
const resendOTP = AuthController.resendOTP;
const forgetPassword = AuthController.forgetPassword;
const resetPassword = AuthController.resetPassword;
const updateUserProfile = AuthController.updateUserProfile;
const updateProfilePicture = AuthController.updateProfilePicture


import CartController from './cartController';

const cartProduct = CartController.cartProduct;
const decreaseCartByOne = CartController.decreaseCartByOne;
const increaseCartByOne = CartController.increaseCartByOne;
const getCartedProduct = CartController.getCartedProduct;
const deleteProductFromCart = CartController.deleteProductFromCart;
const deleteCart = CartController.deleteCart;


import FavouriteController from './favouriteController';
const addOrRemoveProductToFavourite = FavouriteController.addOrRemoveProductToFavourite
const getFavourite = FavouriteController.getFavourite;
const checkProductFromFavourite = FavouriteController.checkProductFromFavourite
const deleteFavourite = FavouriteController.deleteFavourite;


import ProductController from './productController';

const uploadProduct = ProductController.uploadProduct
const updateProduct = ProductController.updateProduct
const getProduct = ProductController.getProduct;
const getAllProduct = ProductController.getAllProduct;
const deleteProduct = ProductController.deleteProduct;


import UserController from './userController';

const registerUser = UserController.registerUser;
const getUser = UserController.getUser;
const getAllUser = UserController.getAllUser;
const deleteUser = UserController.deleteUser;






export const User = {
    registerUser,
    getUser,
    getAllUser,
    deleteUser
};

export const Order = {
    updateOrder,
    getAllOrder,
    getSingleOrder,
    deleteOrder
}
export const Product = {
    uploadProduct,
    updateProduct,
    getProduct,
    getAllProduct,
    deleteProduct
}

export const Checkout = {
    checkout,
    verifyPayment
}

export const Delivery = {
    addDeliveryFee,
    removeDeliveryFee,
    updateDeliveryFee
}

export const Auth = {
    logIn,
    verifyEmail,
    resendEmailVerificiationLink,
    verifyOTP,
    resendOTP,
    forgetPassword,
    resetPassword,
    updateUserProfile,
    updateProfilePicture
}

export const Cart = {
    cartProduct,
    decreaseCartByOne,
    increaseCartByOne,
    getCartedProduct,
    deleteProductFromCart,
    deleteCart
}

export const Favourite = {
    addOrRemoveProductToFavourite,
    getFavourite,
    deleteFavourite,
    checkProductFromFavourite
}
