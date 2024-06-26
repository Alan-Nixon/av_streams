import { NextFunction, Request, Response } from 'express';
import { Fields, Files, IncomingForm } from 'formidable'
//usecase
import { userDetailsInstance } from '../../domain/usecases/Authentication';
import { payloadInterface } from '../../domain/interfaces/AuthenticationInterface';
import { change_user_usecase } from '../../domain/usecases/ChangeUserDetails_useCase';





export const postSignup = async (req: Request, res: Response) => {
    try {
        if (await userDetailsInstance.findByEmail(req.body.Email)) {
            res.status(200).json({ status: false, message: "Email already Exists, try login" })
        } else {
            const userData = await userDetailsInstance.postSignup(req.body)
            res.status(200).json({ status: true, userData, message: "success", token: userData.token })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal error occured" })
    }
}



export const isBlocked = async (req: Request, res: Response, next: NextFunction, userId: string): Promise<boolean | string> => {
    try {

        if (userId) {
            const blocked = await userDetailsInstance.isBlocked(userId)
            if (blocked === "blocked") {
                return "Blocked"
            } else if (blocked === "no user") {
                return "token expired"
            }
        }
        return true

    } catch (error) {
        console.log(error);
        return "error occured in the block middleware"
    }
}



export const postLogin = async (req: Request, res: Response) => {
    try {

        const userData = await userDetailsInstance.findByEmail(req.body.Email)
        if (userData) {
            if (userData.isBlocked) {
                res.status(201).json({ status: 201 })
            } else {
                const token = await userDetailsInstance.isPasswordCorrect(req.body.Password, userData)
                if (token !== "unauthorized") {
                    res.status(200).json({ status: 200, userData, token })
                } else {
                    res.status(202).json({ status: 202 })
                }
            }
        } else {
            res.status(203).json({ status: 203 })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json()
    }
}


export const sendOtp = async (req: Request, res: Response) => {
    try {
        const obj: any = req.query
        const otp = userDetailsInstance.sendOtp(obj.Email)
        res.status(200).json({ status: true, otp })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: false })
    }
}

export const userDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user) {
            const userId = JSON.parse(JSON.stringify(req.user)).id
            const blocked = await isBlocked(req, res, next, userId)
            console.log(blocked);
            if (blocked !== true) {
                res.status(401).json({ status: false, message: blocked })
            } else {
                const userDetails: payloadInterface = JSON.parse(JSON.stringify(req.user))
                const userData = await userDetailsInstance.getUserDetails(userDetails)
                res.status(200).json({ status: true, userData })
            }
        } else {
            throw new Error("req user not found")
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false })
    }
}

export const regenerateToken = async (req: Request, res: Response) => {
    try {
        const data = await userDetailsInstance.createTokenIfRefresh(req)
        res.status(200).json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })
    }
}

export const getWalletDetails = async (req: Request, res: Response) => {
    try {
        const obj: any = req.query
        res.status(200).json(await userDetailsInstance.getWalletDetails(obj.userId))
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: error })
    }
}


//change use case



export const changeProfileImage = async (req: Request, res: Response) => {
    try {
        const form: any = await multipartFormSubmission(req)
        const payload = JSON.parse(JSON.stringify(req.user))
        if (payload) {
            await userDetailsInstance.changeProfile(payload.id, form.files.file[0])
            res.status(200).json({ status: true, message: "changed successfully" })
        } else {
            throw new Error("payload not found")
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false })
    }
}

export const authenticated = (req: Request, res: Response) => {
    res.status(200).json({ status: true, message: "authenticated" })
}





export const forgetPasswordOtpSend = async (req: Request, res: Response) => {
    try {
        const query: any = req.query
        const isSuccess = await change_user_usecase.forgetPassword(query.Email)
        if (isSuccess) {
            res.status(200).json({ status: true, message: "An email has sent to your email" })
        } else {
            res.status(200).json({ status: false, message: "email is not registered" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "some error occured " })
    }
}



export const changePassword = async (req: Request, res: Response) => {
    try {
        const response = await change_user_usecase.changePassword(req.body.userId, req.body.Password)
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "some error occured " })
    }
}



export const changeProfileData = async (req: Request, res: Response) => {
    try {
        await change_user_usecase.changeUserDetails(req.body.userId, req.body.userName,
            req.body.FullName, Number(req.body.Phone));
        res.status(200).json({ status: true })
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })
    }
}



export const changeChannelName = async (req: Request, res: Response) => {
    try {
        const obj: any = req.query
        const payload = JSON.parse(JSON.stringify(req.user))
        const data = await change_user_usecase.changeChannelName(obj.channelName, payload)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ status: false })
    }
}


export const addMoneyToWallet = async (req: Request, res: Response) => {
    try {
        const data = await change_user_usecase.addMoneyToWallet(req.body)
        res.status(200).json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })

    }
}

export const withDrawMoneyToWallet = async (req: Request, res: Response) => {
    try {
        const data = await change_user_usecase.withDrawMoneyToWallet(req.body)
        res.status(200).json(data)
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" })
    }
}


export const subscribeToPremium = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await change_user_usecase.subscribeToPremium(req.body))
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" })
    }
}

export const isPremiumUser = async (req: Request, res: Response) => {
    try {
        const { userId }: any = req.query
        res.status(200).json(await change_user_usecase.isPremiumUser(userId))
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" })
    }
}


export const isFollowing = async (req: Request, res: Response) => {
    try {
        const payload: any = req.query
        res.status(200).json(await change_user_usecase.isFollowing(payload.userId, payload.channelUserId))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const followChannel = async (req: Request, res: Response) => {
    try {
        const payload = JSON.parse(JSON.stringify(req.user as string))
        const channelId: any = req.query.channelId
        res.status(200).json(await change_user_usecase.followChannel(payload.id || "", channelId))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getChannelById = async (req: Request, res: Response) => {
    try {
        const channelId: any = req.query.channelId
        res.status(200).json(await change_user_usecase.getChannelById(channelId))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getChannelByUserId = async (req: Request, res: Response) => {
    try {
        const channelId: any = req.query.channelId
        res.status(200).json(await change_user_usecase.getChannelByUserId(channelId))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getfollowersByUserId = async (req: Request, res: Response) => {
    try {
        const userId: any = req.query.userId
        res.status(200).json(await change_user_usecase.getfollowersByUserId(userId))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getPopularChannels = async (req: Request, res: Response) => {
    try {
        const limit: any = req.query.limit
        res.status(200).json(await change_user_usecase.getPopularChannels(limit))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getTrendingChannels = async (req: Request, res: Response) => {
    try {
        const limit: any = req.query.limit
        res.status(200).json(await change_user_usecase.getTrendingChannels(limit))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getNewChats = async (req: Request, res: Response) => {
    try {
        console.log(req.user);

        const { id }: any = { ...req.user }
        console.log(id);

        res.status(200).json(await change_user_usecase.getNewChats(req.body, id))
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: false, message: error?.message || "internal server error" })
    }
}


export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId: any = req.query.userId
        res.status(200).json(await change_user_usecase.getUserById(userId))
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: false, message: error?.message || "internal server error" })
    }
}

export const getSubscriptionDetails = async (req: Request, res: Response) => {
    try {
        const userId: any = req.query.userId
        res.status(200).json(await change_user_usecase.getSubscriptionDetails(userId))
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: false, message: error?.message || "internal server error" })
    }
}


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
