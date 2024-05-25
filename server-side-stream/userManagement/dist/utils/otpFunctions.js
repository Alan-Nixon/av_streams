"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionSuccessEmail = exports.forgetPasswordLink = exports.sendOtpToEmail = exports.generateOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs_1 = require("fs");
const path_1 = require("path");
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: 'alannixon2520@gmail.com',
        pass: process.env.APPLICATION_PASSWORD
    }
});
const resetPasswordLink = (resetLink) => {
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
    return html;
};
const generateOtp = () => String(Math.floor(Math.random() * 1000000)).padStart(6, '9');
exports.generateOtp = generateOtp;
const sendOtpToEmail = (email, otp) => {
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
        }
        else {
            console.log('Message sent:', info.messageId);
        }
    });
};
exports.sendOtpToEmail = sendOtpToEmail;
const forgetPasswordLink = (Email, userId) => {
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
        }
        else {
            console.log('Message sent:', info.messageId);
        }
    });
};
exports.forgetPasswordLink = forgetPasswordLink;
const subscriptionSuccessEmail = (Email) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionHTML = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "../src/templates/subscription.html"), 'utf8');
    const mailOptions = {
        from: 'Av streams informitech.avfiles@gmail.com',
        to: Email,
        subject: 'subscription success',
        text: `Your Av stream account premium subscription successfull`,
        html: subscriptionHTML
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        }
        else {
            console.log('Message sent:', info.messageId);
        }
    });
});
exports.subscriptionSuccessEmail = subscriptionSuccessEmail;
