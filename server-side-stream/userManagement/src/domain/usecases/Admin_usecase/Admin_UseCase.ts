import { generateToken } from "userauthenticationforavstreams";
import { Admin_Usecase_Interface, userDataInterface } from "../../interfaces/Admin_interface/Admin_interface";
import { userDetailsInstance } from "../Authentication";
import { compare, hash } from "bcryptjs";
import { createChannel, uploadImage } from "../../../../utils/HelperFunction";
import { adminRepositaryLayer } from "../../../data/Repositary/Admin/Admin_Repositary";
import { Request } from "express";
import { responseInterface, walletDataInterface } from "../../interfaces/ChangeUserDetails_interface";
import { SubscriptionInterface } from "../../../data/models/channel";
import { changeUserRepositaryLayer } from "../../../data/Repositary/ChangeUserDetails_Repositary";
import { user_authentication_layer } from "../../../data/Repositary/Authentication_Repositary";

class Admin_useCase implements Admin_Usecase_Interface {

    async post_admin_login(Email: string, Password: string) {
        const adminData = JSON.parse(JSON.stringify(await userDetailsInstance.findByEmail(Email)))
        if (adminData) {
            if (await compare(Password, adminData.Password)) {
                if (adminData.isAdmin) {
                    adminData._id = adminData._id.toString()
                    const token = generateToken(adminData)
                    console.log(token);
                    return { status: true, token, message: "success" }
                } else {
                    return { status: false, message: "unauthorized entry" }
                }
            } else {
                return { status: false, message: "Password do not match" }

            }
        } else {
            return { status: false, message: "email of admin not found" }
        }
    }

    async getAdminDetailsFromReq(userId: string) {
        const data = await userDetailsInstance.findByUserId(userId)
        if (data?.isAdmin) {
            return { status: true, message: "authorized" }
        } else {
            return { status: true, message: "unauthorized" }
        }
    }

    async create_user_useCase(userData: userDataInterface) {
        const data = await userDetailsInstance.findByEmail(userData.Email)
        if (!data) {
            const Password = await hash(userData.Password, 10)
            userData.Password = Password;
            userData.isBlocked = false;
            userData.Phone = Number(userData.Phone)
            const ins = await adminRepositaryLayer.createUserRepo(userData)
            if (ins) createChannel(ins._id + "", ins.userName)
            return { status: true, message: "success" }
        } else {
            return { status: false, message: "user already exist" }
        }
    }

    async findAllUsersNiNAdmin() {
        return await adminRepositaryLayer.findAllUsersNiNAdmin()
    }

    async blockUser(userId: string) {
        return await adminRepositaryLayer.blockUser(userId)
    }

    async addBanner(req: Request) {
        const imageData = req.body.files.imageData[0]
        const location = req.body.fields.location[0]
        const result = await uploadImage(imageData, "avstreamBannerImages")
        return await adminRepositaryLayer.addBanner({ imgUrl: result.url, location })
    }

    async getBannerByLocation(location: string) {
        return await adminRepositaryLayer.getBannerByLocation(location)
    }

    async updateBanner(req: Request) {
        console.log(req.body);
        const file = req.body.files.file[0]
        const bannerId = req.body.fields.bannerId[0]
        console.log(file, bannerId);
        const result = await uploadImage(file, "avstreamBannerImages")
        return await adminRepositaryLayer.updateBanner(result.url, bannerId)
    }

    async getPremiumUsers() {
        return await adminRepositaryLayer.getPremiumUsers()
    }

    async cancelSubscription(Data: SubscriptionInterface) {
        const time = Math.floor((new Date(Data.expires).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        let refund = 1

        if (Data.section === "Yearly Subscription") { refund = time * 7 }
        else if (Data.section === "Monthly Subscription") { refund = time * 17 }
        else if (Data.section === "Weekly Subscription") { refund = time * 28 }

        const wallet = await user_authentication_layer.getWalletDetails(Data.userId)
        const Transactions: walletDataInterface = {
            amount: refund, createdTime: new Date().toString(),
            credited: true, transactionId: "BY ADMIN", userId: Data.userId,
            walletId: wallet?._id
        }
        
        await changeUserRepositaryLayer.addMoneyToWallet(Transactions)
        return await adminRepositaryLayer.cancelSubscription(Data.userId)
    }

}


export const admin_useCase: Admin_Usecase_Interface = new Admin_useCase()