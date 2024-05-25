import { Document, Types } from 'mongoose'
import { postLoginData } from '../../domain/interfaces/AuthenticationInterface';
import { IChannel } from '../models/channel';
import { IWallet } from '../models/wallet';

export interface IUser extends Document {
    _id: Types.ObjectId | string;
    RefreshToken?: string;
    userName: string;
    FullName: string;
    Password: string;
    Phone: number;
    Email: string;
    isAdmin: boolean;
    isBlocked: boolean;
}



export interface userModel_Authentication_inteface {
    postLogin(bodyData: postLoginData): Promise<postLoginData>;
    isBlocked(userId: string): Promise<string>;
    findByEmail_Data(Email: string): Promise<IUser | null>;
    findByUserId(userId: string): Promise<IUser | null>;
    findChannelByUserId(userId: string): Promise<IChannel | null>;
    changeProfile(userId: string, profileImage: string): Promise<boolean>;
    saveDocument(document: IUser): Promise<boolean>;
    newRefreshToken(userId: string, Token: string): Promise<null>
    getWalletDetails(userId: string): Promise<IWallet | null>;
}