import { generateToken } from "userauthenticationforavstreams";
import { Admin_Usecase_Interface, userDataInterface } from "../../interfaces/Admin_interface/Admin_interface";
import { userDetailsInstance } from "../Authentication";
import { compare, hash } from "bcryptjs";
import { createChannel, uploadImage } from "../../../../utils/HelperFunction";
import { adminRepositaryLayer } from "../../../data/Repositary/Admin/Admin_Repositary";
import { Request } from "express";
import { responseInterface } from "../../interfaces/ChangeUserDetails_interface";

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
}


export const admin_useCase: Admin_Usecase_Interface = new Admin_useCase()