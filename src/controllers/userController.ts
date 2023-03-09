
import { RequestHandler } from "express";
import User from "../model/user.model";
import validator from "validator";
import { deleteImage, uploads } from "../utitlity/cloudinary";
import { sendVerificationLink } from "../utitlity/emailSender";
import { emailTokenGenerator } from "../utitlity/token";
import Token from "../model/token.model";
import { StatusCodes } from "http-status-codes";


export type returnTodo = object | null;

class UserController {
    constructor() {
        
    }


    public registerUser: RequestHandler = async(req, res, next) => {
        
        try {
            let reqbody: {
                firstname: string;
                lastname: string;
                username: string;
                email: string;
                password: string;
                confirmpassword: string;
            }

            reqbody = req.body
            
            if (!(reqbody.firstname && reqbody.lastname && req.body.username && reqbody.email && reqbody.password && reqbody.confirmpassword)) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `Failed !!!!!`,
                    message: `All fields must be fieled`
                })
            }
            if (!validator.isEmail(reqbody.email)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: `Failed !!!!!`,
                    message: `Invalid email address supplied`
                })
            }
            if (!validator.isStrongPassword(reqbody.password) && !validator.isStrongPassword(reqbody.confirmpassword)) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `Failed !!!!!`,
                    message: `Password not strong enough !!!!!`
                })
            }
            if (reqbody.password !== reqbody.confirmpassword) {
                return res.status(StatusCodes.CONFLICT).json({
                    status: `Failed !!!!!`,
                    message: `Password not match !!!!`
                })
            }

            let dbUser: any = await User.findOne({$or: [{email: reqbody.email.toLowerCase()}, {username: reqbody.username}]});

            if (dbUser) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: `Failed !!!!!`,
                    message: `User already exist in our database !!!!`
                })
            }

            const cloudImage = await uploads(req,'Users');
            const {public_id, url, secure_url} = cloudImage;
        

            dbUser = await User.create({...req.body, email: reqbody.email.toLowerCase(), 
                profilepicture_public_url: public_id, profilepicture_secure_url: secure_url,
                profilepicture_url: url
            })

            const token: string | undefined = emailTokenGenerator(dbUser.id, dbUser.email, dbUser.username);
            
            const expires: Date | number =  Date.now() + 300000;
            await Token.create({token, user: dbUser._id, expires, type: 'Verification Link'})
            await sendVerificationLink(dbUser.email, dbUser.username, token);

            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `An email confirmation link has been sent to your email address !!!!`,
            })
            
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed `,
                error: error.message
            })
        }
    }


    public getUser: RequestHandler = async(req, res, next) => {
        try {
            
            const {body: {username, email}} = req;

            if (!username && !email) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `User ID is required` 
                })
            }
        
            let dbUser;
            if (username) {
                dbUser = await User.findOne({username});
            }
            else{
            dbUser = await User.findOne({email: email.toLowerCase()});
            }
            
            if (!dbUser) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: `failed`,
                    message: `User not found` 
                })
            }
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `User found`,
                user: dbUser
            })
        } 
        
        catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed `,
                error: error.message
            })
        }
    }

    public getAllUser: RequestHandler = async(req, res, next) => {
        try {
            
            const dbUsers = await User.find();
            if (!dbUsers) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: `failed`,
                    message: `No user found` 
                })
            }

            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Users found`,
                user: dbUsers
            })
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed `,
                error: error.message
            })
        }
    }


    public deleteUser: RequestHandler = async(req, res, next) => {
        try {
            const {body: {id}} = req;

            if (!id) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `User ID is required` 
                })
            }
            
            const dbUser = await User.findById(id);
            if (dbUser?.profilepicture_public_url) {
                deleteImage(dbUser?.profilepicture_public_url)
            }

            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: `failed`,
                    message: `User not found` 
                })
            }
        
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `User deleted`
            })
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed `,
                error: error.message
            })
        }
        
    }   

}

export default new UserController();