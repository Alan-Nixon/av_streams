import { userDataInterface } from "../../../domain/interfaces/Admin_interface/Admin_interface";
import { responseInterface } from "../../../domain/interfaces/ChangeUserDetails_interface";
import { IUserArrayOrNull, admin_repositary_interface } from "../../interfaces/Admin/admin_repositary_interface";
import { IUser } from "../../interfaces/user_Model_Interface";
import { BannerModel } from "../../models/banner";
import { UserModel } from "../../models/user";



class admin_repositary_layer implements admin_repositary_interface {

    async createUserRepo(userData: userDataInterface): Promise<IUser | null> {
        userData.Phone = Number(userData.Phone);
        if (!isNaN(userData.Phone)) {
            console.log(userData, "this is th the repositary layer");
            const ins = await UserModel.insertMany(userData);
            return ins ? ins[0] as IUser : null;
        }
        return null;
    }

    async findAllUsersNiNAdmin(): Promise<IUserArrayOrNull | null> {
        const users = await UserModel.find({ isAdmin: false });
        return users && users.length > 0 ? users : null;
    }

    async blockUser(userId: string) {
        try {
            const data = await UserModel.findById(userId)
            if (data) {
                data.isBlocked = !data?.isBlocked
                await data?.save()
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error(error);
            return false
        }
    }

    async addBanner(Data: Object): Promise<responseInterface> {
        await BannerModel.insertMany(Data)
        return { status: true, message: "success" }
    }

    async getBannerByLocation(location: string): Promise<responseInterface> {
        return { status: true, message: "success", data: await BannerModel.find({ location }) }
    }
}

export const adminRepositaryLayer: admin_repositary_interface = new admin_repositary_layer()