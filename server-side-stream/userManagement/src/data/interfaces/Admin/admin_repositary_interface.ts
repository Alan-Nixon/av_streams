import { userDataInterface } from "../../../domain/interfaces/Admin_interface/Admin_interface";
import { responseInterface } from "../../../domain/interfaces/ChangeUserDetails_interface";
import { IChannel } from "../../models/channel";
import { IUser } from "../user_Model_Interface";


export interface IUserArrayOrNull extends Array<IUser> { }


export interface admin_repositary_interface {
    createUserRepo(userData: userDataInterface): Promise<IUser | null>;
    getChannels(): Promise<IChannel[] | null>;
    findAllUsersNiNAdmin(): Promise<IUserArrayOrNull | null>;
    blockUser(userId: string): Promise<boolean>;
    addBanner(Data: Object): Promise<responseInterface>;
    getBannerByLocation(location: string): Promise<responseInterface>;
    updateBanner(imageUrl: string, bannerId: string): Promise<responseInterface>;
    getPremiumUsers(): Promise<responseInterface>;
    cancelSubscription(userId: string): Promise<responseInterface>;
}