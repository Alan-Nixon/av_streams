import { userDataInterface } from "../../../domain/interfaces/Admin_interface/Admin_interface";
import { responseInterface } from "../../../domain/interfaces/ChangeUserDetails_interface";
import { IUser } from "../user_Model_Interface";


export interface IUserArrayOrNull extends Array<IUser> {}


export interface admin_repositary_interface {
    createUserRepo(userData: userDataInterface): Promise<IUser | null>;
    findAllUsersNiNAdmin(): Promise<IUserArrayOrNull | null>;
    blockUser(userId: string): Promise<boolean>;
    addBanner(Data:Object): Promise<responseInterface>;
    getBannerByLocation(location:string): Promise<responseInterface>;
}