import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { nextTick } from "process";
import { NextFunction } from "express";

const userSchema: mongoose.Schema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, `Firstname field can't be empty !!!!!!!!`],
        trim: true,
        minlength: [3, `Firstname field can't be less than 3 characters !!!!!!!!`],
        maxlength: [50, `Firstname field can't be more than 50 characters !!!!!!!!`]
    },
    lastname: {
        type: String,
        required: [true, `Lastname field can't be empty !!!!!!!!`],
        trim: true,
        minlength: [3, `Lastname field can't be less than 3 characters !!!!!!!!`],
        maxlength: [50, `Lastname field can't be more than 50 characters !!!!!!!!`]
    },
    username: {
        type: String,
        required: [true, `username field can't be empty !!!!!!!!`],
        trim: true,
        minlength: [3, `usernname field can't be less than 3 characters !!!!!!!!`],
        unique: true
    },
    email: {
        type: String,
        required: [true, `email field can't be empty !!!!!!!!`],
        trim: true,
        minlength: [3, `email field can't be less than 3 characters !!!!!!!!`],
        unique: true
    },
    password: {
        type: String,
        required: [true, `password field can't be empty !!!!!!!!`],
        minlength: [3, `password can't be less than 8 characters !!!!!!`],
    },
    confirmpassword: {
        type: String,
        required: [true, `password field can't be empty !!!!!!!!`],
        minlength: [3, `password can't be less than 8 characters !!!!!!`],
    },
    role: {
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user'
    },
    address: {
        type: String
    },
    isEmailVerified: {
        default: false,
        type: Boolean
    },
    phonenumber: {
        type: String,
        requried: true
    },
    profilepicture_public_url: {
        type: String,
    },
    profilepicture_secure_url: {
        type: String
    },
    profilepicture_url: {
        type: String
    },
    companyName: {
        type: String
    },
    lastPasswordChangedAt: {
        type: Date
    }

},
{timestamps: true})


userSchema.pre("save", function (next) {
    if (this.password !== this.confirmpassword) {
        throw Error('Password mismatch !!!!!')
    }
    return next();
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, salt);
    return next()
})

const user = mongoose.model('User', userSchema);

export default user;


