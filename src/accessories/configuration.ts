let dotenvConfig: DotenvConfigOutput;
import { ConfigOptions } from 'cloudinary';
import {config, DotenvConfigOutput} from 'dotenv';
dotenvConfig = config()


export type configType = string | undefined | number | keyof ConfigOptions;



export const PORT: configType = process.env.PORT;
export const JWT_SECRET: string = process.env.JWT_SECRET || '';



//MongoDB AUth Details
export const MONGO_URI: configType = process.env.MONGO_URI;


//Cloudinary Auth Details
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY
export const API_SECRET= process.env.API_SECRET 
export const SECURE: any = process.env.SECURE;


//Paystack Auth Details
export const SECRET_KEY: string | undefined = process.env.SECRET_KEY


//Google Auth Developer Details
export const MAIL_USERNAME: string | undefined = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD: any = process.env.MAIL_PASSWORD;
export const OAUTH_CLIENTID: string | undefined = process.env.OAUTH_CLIENTID;
export const OAUTH_CLIENT_SECRET: string | undefined = process.env.OAUTH_CLIENT_SECRET;
export const OAUTH_REFRESH_TOKEN: string | undefined = process.env.OAUTH_REFRESH_TOKEN;
