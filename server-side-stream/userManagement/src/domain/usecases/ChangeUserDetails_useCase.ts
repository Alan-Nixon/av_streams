import { isValidObjectId } from "../../../utils/commonFunctions";
import { compare, hash } from 'bcryptjs'
import { forgetPasswordLink } from "../../../utils/otpFunctions";
import { user_authentication_layer } from "../../data/Repositary/Authentication_Repositary";
import { changeUserDetails_usecase_interface, responseInterface, walletDataInterface } from "../interfaces/ChangeUserDetails_interface";
import { changeUserRepositaryLayer } from "../../data/Repositary/ChangeUserDetails_Repositary";
import { payloadInterface } from "../interfaces/AuthenticationInterface";
import { SubscriptionInterface } from "../../data/models/channel";



class changeUserDetails_usecase implements changeUserDetails_usecase_interface {
    async forgetPassword(Email: string) {
        const userData = await user_authentication_layer.findByEmail_Data(Email)
        if (userData) {
            forgetPasswordLink(Email, userData._id.toString())
            return true
        } else {
            return false
        }
    }

    async changePassword(userId: string, password: string) {
        if (isValidObjectId(userId)) {
            const userData = await user_authentication_layer.findByUserId(userId)
            if (userData) {
                if (await compare(password, userData.Password)) {
                    return { status: false, message: "new password cannot be same as old password" }
                } else {
                    const newPassword = await hash(password, 10)
                    await changeUserRepositaryLayer.updateNewPassword(newPassword, userData._id.toString())
                    return { status: true, message: "success" }
                }
            } else {
                return { status: false, message: "userId not found" }
            }
        } else {
            return { status: false, message: "userId not found" }
        }
    }

    async changeUserDetails(userId: string, userName: string, FullName: string, Phone: number): Promise<boolean> {
        await changeUserRepositaryLayer.updateUserDetails(userId, userName, FullName, Phone)
        return true
    }

    async changeChannelName(channelName: string, payload: payloadInterface) {
        const data = await changeUserRepositaryLayer.checkChannelName(channelName)
        if (!data) {
            await changeUserRepositaryLayer.changeChannelName(channelName, payload.id)
            return { status: true, message: "success" }
        } else {
            return { status: false, message: "user name is already taken" }
        }
    }

    async addMoneyToWallet(Data: walletDataInterface): Promise<responseInterface> {
        return await changeUserRepositaryLayer.addMoneyToWallet(Data)
    }

    async withDrawMoneyToWallet(Data: walletDataInterface): Promise<responseInterface> {
        return await changeUserRepositaryLayer.withDrawMoneyToWallet(Data)
    }

    async subscribeToPremium(Data: SubscriptionInterface): Promise<responseInterface> {
        return await changeUserRepositaryLayer.subscribeToPremium(Data)
    }

    async isPremiumUser(userId: string): Promise<responseInterface> {
        return await changeUserRepositaryLayer.isPremiumUser(userId)
    }

    async isFollowing(userId: string, channelUserId: string) {
        const channel = await changeUserRepositaryLayer.getChannelByUserId(channelUserId)
        return {
            status: true, message: "success", data: {
                profileLink: await changeUserRepositaryLayer.getProfileLinkByUserId(channelUserId),
                isFollowing: channel.Followers.includes(userId)
            }
        }
    }

    async followChannel(userId: string, channelId: string) {
        return await changeUserRepositaryLayer.followChannel(userId, channelId)
    }

    async getChannelById(channelId: string) {
        return await changeUserRepositaryLayer.getChannelById(channelId)
    }

    async getChannelByUserId(channelId: string) {
        return await changeUserRepositaryLayer.getChannelByUserId(channelId)
    }

    async getfollowersByUserId(userId: string) {
        const response = JSON.parse(JSON.stringify(await changeUserRepositaryLayer.getfollowersByUserId(userId)))
        const followersDetails = await Promise.all(response.data.Followers.map(async (item: string) => {
            const userDetails = await changeUserRepositaryLayer.getUserData(item)
            const channel = await this.getChannelByUserId(userDetails?._id.toString() ?? "")
            return {
                _id: userDetails?._id,
                channelId: channel?._id.toString(),
                userName: userDetails?.userName,
                Email: userDetails?.Email,
                FullName: userDetails?.FullName,
                profileImage: (await this.getChannelByUserId(userId))?.profileImage
            }
        }))

        response.data.Followers = followersDetails
        return response
    }

    async getPopularChannels(limit: number) {
        const response = await changeUserRepositaryLayer.getPopularChannels()
        response.data.sort((a: { Followers: string | any[]; }, b: { Followers: string | any[]; }) => b.Followers.length - a.Followers.length)
        response.data.splice(Math.min(response.data.length, limit))
        return response
    }

    async getTrendingChannels(limit: number) {
        const response = await changeUserRepositaryLayer.getPopularChannels()
        response.data.sort((a: { Videos: string | any[]; }, b: { Videos: string | any[]; }) => b.Videos.length - a.Videos.length)
        response.data.splice(Math.min(response.data.length, limit))
        return response
    }

    async getNewChats(notIn: string[], userId: string) {
        try {

            const { data } = await this.getfollowersByUserId(userId)
            const channels = await Promise.all(data.Followers.map(async (item: any) => {
                const chan = await this.getChannelByUserId(item._id)
                return {
                    userId: chan.userId,
                    archived: false,
                    personDetails: chan,
                    file: { fileType: "", Link: "" },
                    details: [],
                    personId: ""
                }
            }))
            const newChats = channels.filter((item: any) => !notIn.includes(item.userId.toString()))
            return { status: true, message: "success", data: newChats }

        } catch (error: any) {
            console.error(error.message ?? "");

            return { status: false, message: "failed", data: [] }
        }
    }

    async getUserById(userId: string) {
        try {
            console.log(userId);

            return { status: true, message: "success", data: await changeUserRepositaryLayer.getChannelByUserId(userId) }
        } catch (error: any) {
            return { status: false, message: "failed", data: [] }
        }
    }


}

export const change_user_usecase: changeUserDetails_usecase_interface = new changeUserDetails_usecase()