import { subscriptionSuccessEmail } from "../../../utils/otpFunctions";
import { walletDataInterface } from "../../domain/interfaces/ChangeUserDetails_interface";
import { changeUser_ReposatryInterface } from "../interfaces/change_user_repositary_interface";
import { ChannelModel, SubscriptionInterface } from "../models/channel";
import { UserModel } from "../models/user";
import WalletModel from "../models/wallet";


class change_user_repositary_layer implements changeUser_ReposatryInterface {

    async updateNewPassword(password: string, userId: string) {
        await UserModel.findByIdAndUpdate(userId, {
            Password: password
        })
        return true
    }

    async updateUserDetails(userId: string, userName: string, FullName: string, Phone: number) {
        await UserModel.findByIdAndUpdate(userId, {
            userName, FullName, Phone
        })
        return true
    }

    async checkChannelName(channelName: string) {
        return await ChannelModel.findOne({ channelName })
    }

    async changeChannelName(channelName: string, userId: string) {
        await ChannelModel.findOneAndUpdate({ userId }, { channelName })
        return null
    }

    async getChannelNameByUserId(userId: string) {
        const data = await ChannelModel.findOne({ userId })
        return data?.channelName || "not found"
    }

    async getProfileLinkByUserId(userId: string) {
        const data = await ChannelModel.findOne({ userId })
        return data?.profileImage || "no Image"
    }

    async addMoneyToWallet(Data: walletDataInterface) {
        try {
            const data = await WalletModel.findById(Data.walletId)
            delete Data.walletId
            delete Data.userId
            if (data) {
                data.Transactions.push(Data)
                data.Balance += Data.amount
                await data.save()
                return { status: true, message: "success" }
            } else {
                return { status: false, message: "cannot find the wallet" }
            }
        } catch (error) {
            console.error(error);
            return { status: false, message: "error occured" }
        }
    }

    async withDrawMoneyToWallet(Data: walletDataInterface) {
        try {
            const data = await WalletModel.findById(Data.walletId)
            delete Data.walletId
            delete Data.userId
            if (data) {
                if (data.Balance > Data.amount) {
                    data.Transactions.push(Data)
                    data.Balance -= Data.amount
                    await data.save()
                    return { status: true, message: "success" }
                } else {
                    return { status: false, message: "you have not enough balance to withdraw" }
                }
            } else {
                return { status: false, message: "cannot find the wallet" }
            }
        } catch (error) {
            console.error(error);
            return { status: false, message: "error occured" }
        }
    }

    async subscribeToPremium(Data: SubscriptionInterface) {
        try {
            const channel = await ChannelModel.findOne({ userId: Data.userId })
            if (channel) {
                channel.subscription = Data
                channel.premiumCustomer = true
                await channel.save()
                await subscriptionSuccessEmail(Data.email)
                return { status: true, message: "success" }
            } else {
                return { status: false, message: "channel not found correction in userId" }
            }
        } catch (error: any) {
            console.log(error)
            return { status: false, message: error.message || "error occured while updating subscription" }
        }
    }

    async isPremiumUser(userId: string) {
        try {
            const Data = await ChannelModel.findOne({ userId })
            return { status: Data?.premiumCustomer || false, message: "success" }
        } catch (error: any) {
            console.log(error)
            return { status: false, message: error.message || "error occured while fetching premium user" }
        }
    }

    async uploadVideo(Data: any) {
        try {
            const channel = await ChannelModel.findOne({ userId: Data.userId })
            if (channel) {
                channel.Videos.push(Data)
                await channel.save()
                return { status: true, message: "successfully uploded video" }
            } else {
                return { status: false, message: "channel not found" }
            }
        } catch (error: any) {
            console.log(error)
            return { status: false, message: error.message || "error uploded video" }
        }
    }

    async getChannelByUserId(channelId: string) {
        try {
            return await ChannelModel.findOne({ userId: channelId })
        } catch (error: any) {
            return { status: true, message: error.message || "error occured" }
        }
    }

    async followChannel(userId: string, channelId: string) {
        try {
            const channel = await ChannelModel.findOne({ userId: channelId })
            if (channel) {
                if (channel.Followers.includes(userId)) {
                    const array = [...channel.Followers]
                    array.splice(array.indexOf(userId), 1)
                    channel.Followers = array
                } else {
                    channel.Followers.push(userId)
                }

                await channel.save()
                return { status: true, message: "success" }
            } else {
                return { status: false, message: "error updating follow" }
            }
        } catch (error: any) {
            return { status: true, message: error.message || "error occured" }

        }
    }

    async getChannelById(channelId: string) {
        try {
            return { status: true, message: "success", data: await ChannelModel.findById(channelId) }
        } catch (error: any) {
            return { status: true, message: error.message || "error occured" }
        }
    }

    async getfollowersByUserId(userId: string) {
        try {
            return { status: true, message: "success", data: await ChannelModel.findOne({ userId }) }
        } catch (error: any) {
            return { status: true, message: error.message || "error occured" }
        }
    }

    async getUserData(userId: string) {
        try {
            return await UserModel.findById(userId)
        } catch (error: any) {
            return null
        }
    }

    async getProfilesBySearch(search: string) {
        try {
            return JSON.stringify(await ChannelModel.find({ channelName: { $regex: search, $options: 'i' } }))
        } catch (error) {
            console.log(error);
            return "error while fetching data"
        }
    }

    async getPopularChannels() {
        return { status: true, message: "success", data: await ChannelModel.find() }
    }

    async getSubscriptionDetails(userId: string) {
        return { status: true, message: "success", data: await ChannelModel.findOne({ userId }) }
    }
}
export const changeUserRepositaryLayer: changeUser_ReposatryInterface = new change_user_repositary_layer();