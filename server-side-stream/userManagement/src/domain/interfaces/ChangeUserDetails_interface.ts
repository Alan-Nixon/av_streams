import { SubscriptionInterface } from "../../data/models/channel";
import { payloadInterface } from "./AuthenticationInterface";

export interface responseInterface {
    status: boolean;
    message: string;
    data?: any;
}

export interface walletDataInterface {
    userId?: string,
    walletId?: string,
    amount: number,
    transactionId: string,
    credited: boolean,
    createdTime: string
}

export interface changeUserDetails_usecase_interface {
    forgetPassword(Email: string): Promise<boolean>;
    changePassword(userId: string, password: string): Promise<responseInterface>;
    changeUserDetails(userId: string, userName: string, FullName: string, Phone: number): Promise<boolean>;
    changeChannelName(channelName: string, payload: payloadInterface): Promise<responseInterface>;
    addMoneyToWallet(Data: walletDataInterface): Promise<responseInterface>;
    withDrawMoneyToWallet(Data: walletDataInterface): Promise<responseInterface>;
    subscribeToPremium(Data: SubscriptionInterface): Promise<responseInterface>;
    isPremiumUser(userId: string): Promise<responseInterface>;
    isFollowing(userId: string, channelUserId: string): Promise<responseInterface>;
    followChannel(userId: string, channelId: string): Promise<responseInterface>;
    getChannelById(channelId: string): Promise<responseInterface>;
    getChannelByUserId(channelId: string): Promise<responseInterface>;
    getfollowersByUserId(userId: string): Promise<responseInterface>;
    getPopularChannels(limit: number): Promise<responseInterface>;
    getTrendingChannels(limit: number): Promise<responseInterface>;
    getNewChats(notIn: string[], userId: string): Promise<responseInterface>;
} 