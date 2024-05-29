import { checkTokenValidity, generateRefreshToken, generateToken, getDataFromToken, getTokenFromRequest } from "userauthenticationforavstreams";
import { user_authentication_layer } from "../../data/Repositary/Authentication_Repositary";
import { AutheuserDetailsInterface, payloadInterface, postLoginData } from "../interfaces/AuthenticationInterface";
import bcrypt from 'bcryptjs'
import { IUser } from "../../data/interfaces/user_Model_Interface";
import { Types } from "mongoose";
import { generateOtp, sendOtpToEmail } from "../../../utils/otpFunctions";
import { uploadImage } from "../../../utils/HelperFunction";
import { ImageData } from "../../core/interfaces";
import { Request } from "express";


class userDetails_useCase implements AutheuserDetailsInterface {

    async postSignup(bodyData: postLoginData): Promise<postLoginData> {
        try {
            const hashedPassword: string = await bcrypt.hash(bodyData.Password, 10)
            bodyData.Password = hashedPassword
            bodyData.isAdmin = false
            bodyData.isBlocked = false
            const userData = await user_authentication_layer.postLogin(bodyData)
            return {
                userName: userData.userName,
                FullName: userData.FullName,
                Email: userData.Email,
                Phone: userData.Phone,
                Password: userData.Password,
                isAdmin: userData.isAdmin,
                isBlocked: userData.isBlocked,
                profileImage: userData.profileImage,
                token: generateToken(userData)
            }
        } catch (error) {
            throw error;
        }
    } 

    async isBlocked(userId: string) {
        return await user_authentication_layer.isBlocked(userId)
    }

    async findByEmail(Email: string) {
        return await user_authentication_layer.findByEmail_Data(Email)
    }

    async isPasswordCorrect(bodyPassword: string, userData: IUser) {
        if (await bcrypt.compare(bodyPassword, userData.Password)) {
            const userId = userData._id instanceof Types.ObjectId ? userData._id.toString() : userData._id;
            const Data = { ...userData, _id: userId } 
            const token = generateToken(Data);
            return token;
        } else {
            return "unauthorized"
        }
    }

    sendOtp(Email: string) {
        const otp = generateOtp()
        sendOtpToEmail(Email, Number(otp))
        return otp.toString()
    }

    async findByUserId(userId: string) {
        return await JSON.parse(JSON.stringify(await user_authentication_layer.findByUserId(userId)))
    }

    async findChannelByUserId(userId: string) {
        return user_authentication_layer.findChannelByUserId(userId)
    }

    async getUserDetails(userData: payloadInterface) {
        const Details = await this.findByUserId(userData.id)
        const channelDetails = await this.findChannelByUserId(userData.id)
        if (channelDetails) {
            Details.profileImage = channelDetails.profileImage
            Details.channelName = channelDetails.channelName
            return Details
        } else {
            return null
        }
    }

    async changeProfile(userId: string, file: ImageData) {
        const result = await uploadImage(file, "avstreamProfileImages")
        await user_authentication_layer.changeProfile(userId, result.url)
        return null
    }

    async createTokenIfRefresh(req: Request) {
        const data: payloadInterface = getDataFromToken(getTokenFromRequest(req) || "") as payloadInterface
        const userData = await this.findByUserId(data.id)
        const res = await checkTokenValidity(userData.RefreshToken, false)
        if (!res) {
            return { status: true, message: "refresh token expired", token: generateToken(userData) }
        } else {
            await user_authentication_layer.newRefreshToken(data.id, generateRefreshToken(userData))
            return { status: false, message: "refresh token expired" }
        }
    }

    async getWalletDetails(userId: string) {
        const walletDetails = await user_authentication_layer.getWalletDetails(userId)
        if (walletDetails) {
            return {
                status: true,
                message: "success",
                Data: walletDetails
            }
        } else {
            return {
                status: false,
                message: "failed"
            }
        }
    }
}


export const userDetailsInstance: AutheuserDetailsInterface = new userDetails_useCase();