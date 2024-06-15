import nodemailer from 'nodemailer'
import dotenv from 'dotenv'; dotenv.config();
import { readFileSync } from 'fs'
import { join } from 'path'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'alannixon2520@gmail.com',
        pass: process.env.APPLICATION_PASSWORD
    }
});

const resetPasswordLink = (resetLink: string) => {
    const html = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 40px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333333;
                    text-align: center;
                }
                p {
                    color: #666666;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .btn {
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    margin-top: 20px;
                }
                .btn:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Reset Your Password</h1>
                <p>We received a request to reset your password. Click the button below to set a new password:</p>
                <a href="${resetLink}" style="color:'#ffffff'" class="btn">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email. Please, Don't Reply to this email</p>
                <p>Thank you,</p>
                <p>AV streams</p>
            </div>
        </body>
        </html>
    `;
    return html
};


export const generateOtp = () => String(Math.floor(Math.random() * 1000000)).padStart(6, '9')

export const sendOtpToEmail = (email: string, otp: number) => {
    console.log(`your otp is ${otp}`);

    const mailOptions = {
        from: 'Av streams informitech.avfiles@gmail.com',
        to: email,
        subject: 'Otp',
        text: `Your Av stream OTP is ${otp}`,
        html: `<b>Your Av stream OTP is ${otp}</b>`
    };

 
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Message sent:', info.messageId);
        }
    });
};


export const forgetPasswordLink = (Email: string, userId: string) => {
    const mailOptions = {
        from: 'Av streams informitech.avfiles@gmail.com',
        to: Email,
        subject: 'Forget Password',
        text: `Your Av stream Password reset link is ${process.env.CLIENT_SIDE_URL}/forgetPassword?userId=${userId}`,
        html: resetPasswordLink(`${process.env.CLIENT_SIDE_URL}/forgetPassword?userId=${userId}`)
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Message sent:', info.messageId);
        }
    });
}




export const subscriptionSuccessEmail = async (Email: string) => {
    const subscriptionHTML = readFileSync(join(__dirname, "../src/templates/subscription.html"), 'utf8')

    const mailOptions = {
        from: 'Av streams informitech.avfiles@gmail.com',
        to: Email,
        subject: 'subscription success',
        text: `Your Av stream account premium subscription successfull`,
        html: subscriptionHTML
    };
    console.log(mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Message sent:', info.messageId);
        }
    });
}
 