import { generateName } from "user_random_name_generator";
import { postLoginData } from "../../domain/interfaces/AuthenticationInterface";
import { IUser, userModel_Authentication_inteface } from "../interfaces/user_Model_Interface";
import { ChannelModel } from "../models/channel";
import { UserModel } from "../models/user";
import { generateRefreshToken } from "userauthenticationforavstreams";
import WalletModel from "../models/wallet";


class Authentication_Data_Layer implements userModel_Authentication_inteface {

    async postLogin(bodyData: postLoginData): Promise<postLoginData> {
        const userDataArray = await UserModel.insertMany(bodyData);
        const userData = userDataArray[0];
        if (!userData) { throw new Error('No user data inserted'); }
        const userId = userData._id.toString();
        const passByvalue = JSON.parse(JSON.stringify(userData))
        passByvalue._id = passByvalue._id.toString()
        userData.RefreshToken = generateRefreshToken(passByvalue)
        await userData.save()
        await ChannelModel.insertMany({
            userId: userId,
            userName: userData.userName,
            channelName: await generateName(),
            profileImage: userData.profileImage || "https://e1.pxfuel.com/desktop-wallpaper/1012/835/desktop-wallpaper-no-profile-pic-no-profile.jpg"
        });
        await WalletModel.insertMany({
            userId: userId,
            userName: userData.userName,
            balance: 0,
            Transactions: []
        })
        userData.profileImage = userData.profileImage || "https://e1.pxfuel.com/desktop-wallpaper/1012/835/desktop-wallpaper-no-profile-pic-no-profile.jpg"
        return userData;
    }

    async isBlocked(userId: string): Promise<string> {
        const user = await UserModel.findById(userId);
        if (!user) {
            return "no user"
        } else if (user.isBlocked) {
            return "blocked"
        } else {
            return "success"
        }
    }

    async findByEmail_Data(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ Email: email });
        if (!user) {
            return null
        }
        return user.toObject() as IUser;
    }



    async findByUserId(userId: string) {
        return JSON.parse(JSON.stringify(await UserModel.findById(userId)))
    }

    async findChannelByUserId(userId: string) {
        return await ChannelModel.findOne({ userId })
    }

    async changeProfile(userId: string, profileImage: string) {
        try {
            const data = await this.findChannelByUserId(userId)
            if (data) {
                data.profileImage = profileImage
                await data.save()
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async saveDocument(document: IUser) {
        try {
            const Details = new UserModel(document)
            await Details.save()
            return true
        } catch (error) {
            console.error(error);
            return false
        }
    }

    async newRefreshToken(userId: string, Token: string) {
        await UserModel.findByIdAndUpdate(userId, {
            RefreshToken: Token
        })
        return null
    }

    async getWalletDetails(userId:string) {
        return await WalletModel.findOne({userId})
    }
}


export const user_authentication_layer: userModel_Authentication_inteface = new Authentication_Data_Layer()