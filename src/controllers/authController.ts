import bcrypt from 'bcrypt';
import { tokenGenerator, verifyToken, emailTokenGenerator } from "../utitlity/token";
import { generateOTP } from "../utitlity/otp";
import { RequestHandler } from "express";
import User from '../model/user.model';
import Token from '../model/token.model'
import { sendOTP, sendResetPasswordLink, sendVerificationLink } from '../utitlity/emailSender';
import { JwtPayload } from 'jsonwebtoken';
import validator from 'validator';
import {
	StatusCodes,
} from 'http-status-codes';
import { deleteImage, uploads } from '../utitlity/cloudinary';



class AuthController {
    
    constructor() {
        
    }
    
    public logIn: RequestHandler = async(req, res, next) => {
        type tokenType = string | undefined;
    
        interface loginType {
            username: string;
            email: string;
            role: string;
            password: string
            id: string,
            isEmailVerified: boolean
        }
        let username: string;
        let password: string;
        let email: string;
    
        try {
            
            const reqbody: loginType = req.body
            username = reqbody.username;
            email = reqbody.email;
            password = reqbody.password;
    
            if(!(username || email) && !password) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: `failed !!!!!`,
                    message: `All fields must be filled`
                })
            }
    
            let userDB: loginType | null = await User.findOne({$or: [{username}, {email}]})
            if (!userDB) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `success`,
                    message: `Invalid credentials !!!!!!`
                })
            }
            const match = await bcrypt.compare(password, userDB.password);
            
            if (!match) {
                return res.status(StatusCodes.CONFLICT).json({
                    status: `failed`,
                    message: `Invalid email or password !!!!!!!!!`
                })
            }
    
            if (userDB.isEmailVerified === false) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: `failed`,
                    message: `Account not verified yet, click on the verification link sent to your email !!!!!!!!!`
                })
            }
            
            const otp: string = generateOTP(10);
            const expires = Date.now() + 300000;
    
            await sendOTP(userDB.email, userDB.username, otp);
            await Token.create({token: otp, user: userDB.id, expires, type: 'Login OTP'});
    
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `A one-time-password has been sent to your registered email address ...`,
                otp
            })
            
        
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: `failed`,
            message: error.message
        })
    }
     
    }

    public verifyEmail: RequestHandler = async(req, res, next) => {

        interface payload {
            username: string;
            email: string;
            user_id: string;
        }
    
        interface dbObject {
            isEmailVerified: boolean
        }
    
        try {
            const {params: {token}} = req;
            const payload: payload | JwtPayload |string | any  = verifyToken(token);
            const dbToken: any = await Token.findOne({user: payload.user_id, type: 'Verification Link'})
        
            if(!token) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Invalid link !!!!!!!!!`
                })
            }
    
            if (!payload) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Error completing this operation !!!!!!!!!`
                })
            }
    
            if (!dbToken) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Expired link !!!!!!!!!`
                })
                
            }
            
            const {user_id} = payload;
            const dbUser: dbObject | any = await User.findById(user_id);
            if (dbUser.isEmailVerified === true) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Linked already used !!!!!!!!!`
                })
            }
            
            await User.findByIdAndUpdate({_id: user_id}, {isEmailVerified: true})
    
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Account verified .......`
            })
    
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: `failed`,
            message: error.message
        })
    }
    };
    
    public resendEmailVerificiationLink:RequestHandler = async(req, res, next) => {
        try {
            const {params: {token}} = req;
            const payload: any = verifyToken(token);
    
            const newToken: string | undefined = emailTokenGenerator(payload.id, payload.email, payload.username);
            const expires: Date | number =  Date.now() + 300000;
            await Token.create({token, user: payload.id, expires, type: 'Verification Link'})
            await sendVerificationLink(payload.email, payload.username, newToken);
    
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Verification link has been resent to ${payload.email}`
            })
        
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            }) 
        }
    }
    public verifyOTP: RequestHandler = async(req, res, next) => {
    
        try {
    
            const {params: {user_id},
                    body: {otp}
                                    } = req;
            if (!user_id) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Invalid credentials !!!!!!!!!`
                })
            }
        
            const dbToken = await Token.findOne({user: user_id, type: 'Login OTP'});
            
            if(dbToken) {
                if (dbToken?.token === otp) {
                    if (dbToken?.valid) {
                        const loginUser: any = await User.findById(user_id);
                        const token: string = tokenGenerator(user_id, loginUser.role, loginUser.email, loginUser.username);
         
                        if (token) {
                            dbToken.valid = false;
                            dbToken.save();
                            return res.status(StatusCodes.OK).json({
                                status: `success`,
                                message: `Login successful ..........`,
                                token
                            })
                    }
    
                    return res.status(StatusCodes.EXPECTATION_FAILED).json({
                        status: `failed`,
                        message: `Unable to generate login token !!!`
                    })
    
                }
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Invalid one-time-password !!!`,
                })
                
            }
            return res.status(StatusCodes.EXPECTATION_FAILED).json({
                status: `failed`,
                message: `Invalid one-time-password !!!`,
            })
        }
        return res.status(StatusCodes.EXPECTATION_FAILED).json({
            status: `failed`,
            message: `Your one-time-password has expired !!!`,
        });
    
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }
    
    }
    
    public resendOTP: RequestHandler = async(req, res, next) => {
        try {
            const {params: {user_id},
                            } = req;
            
            const userDB: any = await User.findById(user_id)
            const otp = generateOTP(10);
            
            const dbOTP = await Token.findOne({user: user_id, type: 'Login OTP'});
            
            
            if(dbOTP) {
                const expires = Date.now() + 300000;
                await sendOTP(userDB.email, userDB.username, otp);
                await Token.findByIdAndUpdate(dbOTP.id, {token: otp, expires}); 
    
                return res.status(StatusCodes.OK).json({
                    status: `success`,
                    message: `A one-time-pssword has been resent to your registered email address ...`
                });
            }
    
            const expires = Date.now() + 300000;
            await sendOTP(userDB.email, userDB.username, otp);
            await Token.create({token: otp, user: user_id, expires, type: 'Login OTP'});
            
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `A one-time-pssword has been resent to your registered email address ...`,
                otp
            });
    
        } catch (error: any) {
            return next(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            }))
        }
    }
    
    public forgetPassword: RequestHandler = async(req, res, next) => {
    
        try {
            const {body: {email, username}} = req;
            if(!validator.isEmail(email)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: `failed`,
                    message: `Invalid email address !!!`
                })
            }
    
            const dbUser = await User.findOne({$or: [{email: email. toLowerCase()}, {username}]});
    
            if (!dbUser) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: `failed`,
                    message: `User not found !!!`
                })
            }
    
            const token = emailTokenGenerator(dbUser.id, dbUser.role, dbUser.email);
    
            if (!token) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Unable to generate token !!!`
                })
            }
    
            const dbToken = await Token.findOne({user: dbUser.id, type: 'Password Reset'});
            
            if (dbToken) {
                const expires = Date.now() + 300000;
                sendResetPasswordLink(dbUser.email, dbUser.username, token);
                await Token.findByIdAndUpdate(dbToken.id, {token, expires});
            
                return res.status(StatusCodes.OK).json({
                    status: `success`,
                    message: `A password reset link has been resent to ${dbUser.email}`
                });
                 
            }
            const expires = Date.now() + 300000;
            sendResetPasswordLink(dbUser.email, dbUser.username, token);
            await Token.create({token, user: dbUser.id, expires, type: 'Password Reset'});
    
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `A password reset link has been sent to ${dbUser.email}`
            });
    
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }
    }
    
    public resetPassword: RequestHandler = async(req, res, next) => {
    
        try {
    
    
                const {body: {newPassword, confirmNewPassword},
                params: {token}
                                    } = req;
                const payload: any = verifyToken(token)
                const user_id = payload.user_id;
                                    
                const validityCheck: any = await Token.findOne({user: user_id, type: 'Password Reset'});
                console.log(validityCheck);
                
    
                if (!validityCheck) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: `failed`,
                        message: `Invalid link !!!`
                    });
                }
    
                if (validityCheck.valid === false) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: `failed`,
                        message: `Invalid link !!!`
                    });
                }
    
                if (!validator.isStrongPassword(newPassword || !validator.isStrongPassword(confirmNewPassword))) {
                    return res.status(StatusCodes.EXPECTATION_FAILED).json({
                        status: `failed`,
                        message: `Password not strong enough !!!`
                    });
                }
    
                if (newPassword !== confirmNewPassword) {
                    return res.status(StatusCodes.CONFLICT).json({
                        status: `failed`,
                        message: `Password not match`
                    });
                }
                
                if (validityCheck.token !== token) {
                    return res.status(StatusCodes.EXPECTATION_FAILED).json({
                        status: `failed`,
                        message: `Invalid link !!!`
                    });
                }
                
                
                const updateUser = await User.findById(user_id);
            
                if (!updateUser) {
                    return res.status(StatusCodes.EXPECTATION_FAILED).json({
                        status: `failed`,
                        message: `Unabale to change your password this time !!!`
                    });
                }
    
                updateUser.password = newPassword;
                updateUser.confirmpassword = confirmNewPassword;
                updateUser.save();
    
                const updatedToken = await Token.findOneAndUpdate({id: user_id, type: 'Password Reset'}, {valid: false});
    
                return res.status(StatusCodes.OK).json({
                    status: `Success !!!`,
                    message: `Password reset successful ...`
                })
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `Failed !!!`,
                message: error.message
            })
        }
    }
    
    
    public updateUserProfile: RequestHandler = async(req, res, next) => {
        try {
            const {user: {user_id}} = req;
            if (!req.body) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: `failed`,
                    message: `NO field specified for update`
                })
            }
    
            if(req.body.username){
                const dbUser = await User.findOne({username: req.body.username});
                if (dbUser) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: `failed`,
                        message: `Username already exist`
                    })
                }
            }
            if (req.body.email) {
                const dbUser = await User.findOne({email: req.body.email});
                if (dbUser) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: `failed`,
                        message: `email already exist`
                    })
                }
            }
            const updatedUser = await User.findByIdAndUpdate({_id: user_id}, {...req.body}, {new: true});
            if (!updatedUser) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Error encountered while trying to update your record`
                })
            }
    
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Profile successfully updated`,
                user: updatedUser
            })
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed `,
                error: error.message
            })
        }
    
    }
    
    
    public updateProfilePicture: RequestHandler = async(req, res, next) => {
        try {
            const {user: {user_id}} = req;
    
            if (!req.file) {
                return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    status: `failed`,
                    message: `Picture not selected`
                })
            }
            const dbUser : any= await User.findById(user_id);
    
            deleteImage(dbUser.profilepicture_public_url);
    
            const cloudImage = await uploads(req,'Users');
            const {public_id, url, secure_url} = cloudImage;
    
            dbUser.profilepicture_public_url = public_id;
            dbUser.profilepicture_secure_url = secure_url;
            dbUser.profilepicture_url = url;
            const updatedUser = await dbUser.save();
    
            if (!updatedUser) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: `failed`,
                    message: `Error encountered while trying to update your profile picture`
                })
            }
    
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Profile picture updated`,
                user: updatedUser
            })
            
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed `,
                error: error.message
            })
        }
    }
}

export default new AuthController();