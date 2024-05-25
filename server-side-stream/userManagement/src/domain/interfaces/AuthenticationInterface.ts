import { Request } from "express";
import { IUser } from "../../data/interfaces/user_Model_Interface";
import { IChannel } from "../../data/models/channel";
import { ImageData } from "../../core/interfaces";

export interface payloadInterface {
    id: string,
    username: string,
    isAdmin: boolean,
    email: string,
    iat: number
}

export interface userDetailsChannel {
    id: string,
    username: string,
    isAdmin: boolean,
    email: string,
    iat: number,
    profileImage?: string,
    channelName?: string
}

export interface jsonResponse {
    status: boolean,
    message: string,
    token?: string
}

export interface AutheuserDetailsInterface {
    postSignup(bodyData: postLoginData): Promise<postLoginData>;
    isBlocked(userId: string): Promise<string>;
    findByEmail(Email: string): Promise<IUser | null>;
    isPasswordCorrect(bodyPassword: string, userData: IUser): Promise<string>;
    sendOtp(Email: string): string;
    findByUserId(userId: string): Promise<IUser | null>;
    findChannelByUserId(userId: string): Promise<IChannel | null>;
    getUserDetails(userData: payloadInterface): Promise<userDetailsChannel | null>;
    changeProfile(userId: string, file: ImageData): Promise<null>;
    createTokenIfRefresh(req: Request): Promise<jsonResponse>;
    getWalletDetails(userId: string): Promise<jsonResponse>;
}



export interface postLoginData {
    userName: string,
    FullName: string,
    profileImage: string,
    Phone: number,
    Email: string,
    Password: string,
    confirmPassword?: string,
    isAdmin: boolean,
    isBlocked: boolean,
    token?: string,
}

export interface generateTokenData {
    id: string;
    iat: number;
    email: string,
    username: string,
    isAdmin: boolean;
}
