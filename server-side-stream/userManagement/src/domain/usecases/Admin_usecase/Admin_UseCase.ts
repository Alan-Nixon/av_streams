import { generateToken } from "userauthenticationforavstreams";
import { Admin_Usecase_Interface, userDataInterface } from "../../interfaces/Admin_interface/Admin_interface";
import { userDetailsInstance } from "../Authentication";
import { compare, hash } from "bcryptjs";
import { createChannel, uploadImage } from "../../../../utils/HelperFunction";
import { adminRepositaryLayer } from "../../../data/Repositary/Admin/Admin_Repositary";
import { Request } from "express";
import { walletDataInterface } from "../../interfaces/ChangeUserDetails_interface";
import { SubscriptionInterface } from "../../../data/models/channel";
import { changeUserRepositaryLayer } from "../../../data/Repositary/ChangeUserDetails_Repositary";
import { user_authentication_layer } from "../../../data/Repositary/Authentication_Repositary";
import { getDate, getDatesOfCurrentYear, getLastMonths } from "../../../../utils/commonFunctions";
import { Fields, Files, IncomingForm } from 'formidable'

class Admin_useCase implements Admin_Usecase_Interface {

    errorResponse(error: any) {
        return { status: true, message: error.message ?? "failed" }
    }

    async post_admin_login(Email: string, Password: string) {
        try {
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
        } catch (error) {
            return this.errorResponse(error)
        }
    }

    async getAdminDetailsFromReq(userId: string) {
        try {
            const data = await userDetailsInstance.findByUserId(userId)
            if (data?.isAdmin) {
                return { status: true, message: "authorized" }
            } else {
                return { status: true, message: "unauthorized" }
            }
        } catch (error: any) {
            return this.errorResponse(error)
        }
    }

    async create_user_useCase(userData: userDataInterface) {
        try {
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
        } catch (error: any) {
            return this.errorResponse(error)
        }
    }

    async findAllUsersNiNAdmin() {
        try {
            return await adminRepositaryLayer.findAllUsersNiNAdmin()
        } catch (error: any) {
            return []
        }
    }

    async blockUser(userId: string) {
        try {
            return await adminRepositaryLayer.blockUser(userId)
        } catch (error: any) {
            return false
        }
    }

    async addBanner(req: Request) {
        try {
            const form: any = await multipartFormSubmission(req)
            const imageData = form.files.imageData[0]
            const location = form.fields.location[0]
            const result = await uploadImage(imageData, "avstreamBannerImages")
            return await adminRepositaryLayer.addBanner({ imgUrl: result.url, location })
        } catch (error: any) {
            return this.errorResponse(error)
        }
    }

    async getBannerByLocation(location: string) {
        try {
            return await adminRepositaryLayer.getBannerByLocation(location)
        } catch (error: any) {
            return this.errorResponse(error)
        }
    }

    async updateBanner(req: Request) {
        try {
            
            const form: any = await multipartFormSubmission(req)
            const file = form.files.file[0]
            const bannerId = form.fields.bannerId[0]
            const result = await uploadImage(file, "avstreamBannerImages")
            return await adminRepositaryLayer.updateBanner(result.url, bannerId)

        } catch (error: any) {
            return this.errorResponse(error)
        }
    }

    async getPremiumUsers() {
        try {
            return await adminRepositaryLayer.getPremiumUsers()
        } catch (error: any) {
            return this.errorResponse(error)
        }
    }

    async cancelSubscription(Data: SubscriptionInterface) {
        try {
            const time = Math.floor((new Date(Data.expires).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            let refund = 1

            if (Data.section === "Yearly Subscription") { refund = time * 7 }
            else if (Data.section === "Monthly Subscription") { refund = time * 17 }
            else if (Data.section === "Weekly Subscription") { refund = time * 28 }
            else { refund = refund * 0}
            const wallet = await user_authentication_layer.getWalletDetails(Data.userId)
            const Transactions: walletDataInterface = {
                amount: refund, createdTime: new Date().toString(),
                credited: true, transactionId: "BY ADMIN", userId: Data.userId,
                walletId: wallet?._id
            }
            console.log(Data.userId);
            
            await changeUserRepositaryLayer.addMoneyToWallet(Transactions)
            return await adminRepositaryLayer.cancelSubscription(Data.userId)
        } catch (error: any) {
            return this.errorResponse(error)
        }
    }

    async getDoungnutData() {
        try {
            const channels = await adminRepositaryLayer.getChannels();
            const users = (await adminRepositaryLayer.findAllUsersNiNAdmin())?.length ?? 0;

            const data = [{
                completeText: "Total users have streams",
                remainingText: "Total users dont have streams",
                completedPercentage: 0,
                remainingPercentage: 0,
                count: 0
            }, {
                completeText: "Total users have video",
                remainingText: "Total users dont have video",
                completedPercentage: 0,
                remainingPercentage: 0,
                count: 0
            }, {
                completeText: "Total users have shorts",
                remainingText: "Total users dont have shorts",
                completedPercentage: 0,
                remainingPercentage: 0,
                count: 0
            }];

            const allVideo = channels?.map(item => item.Videos).flat(Infinity);
            const allStream = channels?.map(item => item.Streams).flat(Infinity);
            data[0].count = allStream?.length ?? 0;

            allVideo?.forEach((item: any, index: number) => {
                if (item.shorts) { data[2].count++ }
                else if (!item.shorts) { data[1].count++ }
            });

            data.forEach(item => {
                item.completedPercentage = Math.floor((item.count / users ?? 1) * 100)
                item.remainingPercentage = Math.floor(((users - item.count) / users) * 100)
            })


            return { status: true, message: "success", data }
        } catch (error: any) {
            console.log(error);
            return this.errorResponse(error)
        }
    }

    async getLastSubscriptions(monthCount: number) {
        try {
            const months = getLastMonths(monthCount);
            const data = months.map(item => 0)
            const channels = (await adminRepositaryLayer.getChannels())?.filter(item => item.subscription.expires !== "");

            let expiryDates = []
            if (channels) {
                for (const chan of channels) {
                    let exp = chan.subscription.expires
                    let days = exp === "Yearly Subscription" ? 365 : exp === "Montly Subscription" ? 28 : 7
                    expiryDates.push(getDate(days, false, chan.subscription.expires))
                }
            }
            expiryDates = getDatesOfCurrentYear(expiryDates)
            expiryDates.map((item) => {
                const month = new Date(item).getMonth();
                if (data[month] !== undefined)
                    data[month] += 1
            })

            return { status: true, message: "success", data: { months, data } }
        } catch (error: any) {
            return this.errorResponse(error)
        }
    }

}


export const admin_useCase: Admin_Usecase_Interface = new Admin_useCase();



function multipartFormSubmission(req: Request): Promise<{ files: Files; fields: Fields }> {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve({ files, fields });
            }
        });
    });
}