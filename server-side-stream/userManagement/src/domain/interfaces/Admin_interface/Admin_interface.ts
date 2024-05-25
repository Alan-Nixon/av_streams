import { IUserArrayOrNull } from "../../../data/interfaces/Admin/admin_repositary_interface";
import { responseInterface } from "../ChangeUserDetails_interface";
import { Request } from "express";

export interface userDataInterface {
    userName: string,
    FullName: string,
    Email: string,
    Password: string,
    confirmPassword: string,
    Phone: string | number,
    isAdmin: boolean,
    isBlocked?: boolean
}

export interface Admin_Usecase_Interface {
    post_admin_login(Email: string, Password: string): Promise<responseInterface>;
    getAdminDetailsFromReq(userId: string): Promise<responseInterface>;
    create_user_useCase(userData: userDataInterface): Promise<responseInterface>;
    findAllUsersNiNAdmin(): Promise<IUserArrayOrNull | null>;
    blockUser(userId: string): Promise<boolean>;
    addBanner(req: Request): Promise<responseInterface>;
    getBannerByLocation(location:string): Promise<responseInterface>;
}