import { responseInterface, walletDataInterface } from "../../domain/interfaces/ChangeUserDetails_interface";
import { IChannel, SubscriptionInterface } from "../models/channel";
import { IUser } from "./user_Model_Interface";


export interface changeUser_ReposatryInterface {
    updateNewPassword(password: string, userId: string): Promise<boolean>;
    updateUserDetails(userId: string, userName: string, FullName: string, Phone: number): Promise<boolean>;
    checkChannelName(channelName: string): Promise<IChannel | null>;
    changeChannelName(channelName: string, userId: string): Promise<null>;
    getChannelNameByUserId(userId: string): Promise<string>;
    getProfileLinkByUserId(userId: string): Promise<string>;
    addMoneyToWallet(Data: walletDataInterface): Promise<responseInterface>;
    withDrawMoneyToWallet(Data: walletDataInterface): Promise<responseInterface>;
    subscribeToPremium(Data: SubscriptionInterface): Promise<responseInterface>;
    isPremiumUser(userId: string): Promise<responseInterface>;
    uploadVideo(Data: any): Promise<responseInterface>;
    getChannelByUserId(channelId: string): Promise<any>;
    getChannelById(channelId: string): Promise<responseInterface>;
    followChannel(userId: string, channelId: string): Promise<responseInterface>;
    getfollowersByUserId(userId: string): Promise<responseInterface>;
    getUserData(userId: string): Promise<IUser | null>;
    getProfilesBySearch(search:string):Promise <string>;
}