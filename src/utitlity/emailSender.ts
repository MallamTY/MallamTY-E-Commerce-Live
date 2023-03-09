import nodemailer from 'nodemailer';
import { MAIL_USERNAME, MAIL_PASSWORD,
    OAUTH_CLIENTID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN 
} from '../accessories/configuration';
import { templateValues } from '../templates/emailVerification';
import { Templates } from '../templates';



export const sendEmail = async(to: string,
    subject: string, html: string
    ) =>  {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                //type: 'OAuth2',
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
                clientId: OAUTH_CLIENTID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN
            }
            });
            
            const mailOptions = { 
                from: `MallamTY E-Commerce aderogbalilian@gmail.com`,
                to,
                subject,
                html,
            }
            
            return await transporter.sendMail(mailOptions)
            .catch((error) => new Error("Unable to send otp"));
}


export const sendOTP = async(to: string, username: string, otp: string) => {
  
    const otpTemplateValues: templateValues = Templates.emailOTPTemplate(otp, username);
    const email: string = to;
    const html: string = otpTemplateValues.html;
    const subject: string = 'Login One-Time-Password';

    const sent = await sendEmail(email, subject, html);
}


export const sendVerificationLink = async(to: string, username: string, token: string | undefined) => {

    const url = `http://localhost:7000/ecommerce/v1/auth/verify-email/${token}`;
    const subject: string = 'Verification Link';
    const tokenTemplateValues: templateValues = Templates.emailTemplate(url, username);
    const html: string = tokenTemplateValues.html;

    await sendEmail(to,subject, html);
}

export const sendResetPasswordLink = async(to: string, username: string, token: string | undefined) => {

    const url = `http://localhost:7000/ecommerce/v1/auth/reset-password/${token}`;
    const subject: string = 'Reset Password';
    const tokenTemplateValues: templateValues = Templates.passwordResetTemplate(url, username);
    const html: string = tokenTemplateValues.html;

    await sendEmail(to,subject, html);
}