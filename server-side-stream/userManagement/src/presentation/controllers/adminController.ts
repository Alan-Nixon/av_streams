import { Request, Response } from "express";
import { admin_useCase } from "../../domain/usecases/Admin_usecase/Admin_UseCase";



export const adminPostLogin = async (req: Request, res: Response) => {
    try {
        const response = await admin_useCase.post_admin_login(req.body.Email, req.body.Password)
        res.status(200).json(response)
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })
    }
}



export const isAdminAuth = async (req: Request, res: Response) => {
    try {
        const userId: string = JSON.parse(JSON.stringify(req.user)).id
        const response = await admin_useCase.getAdminDetailsFromReq(userId)
        res.status(200).json(response)
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })
    }
}



export const createUser = async (req: Request, res: Response) => {
    try {
        const response = await admin_useCase.create_user_useCase(req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "error occured" })
    }
}




export const getAllUsers = async (req: Request, res: Response) => {
    try {

        const usersData = await admin_useCase.findAllUsersNiNAdmin()
        if (usersData) {
            return res.status(200).json({ status: true, usersData })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}




export const blockUser = async (req: Request, res: Response) => {
    try {
        const obj: any = req.query
        await admin_useCase.blockUser(obj.userId)
        return res.status(200).json({ status: true })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}


export const addBanner = async (req: Request, res: Response) => {
    try {
        await admin_useCase.addBanner(req)
        return res.status(200).json({ status: true })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}


export const getBannerByLocation = async (req: Request, res: Response) => {
    try {
        const location: any = req.query.location
        return res.status(200).json(await admin_useCase.getBannerByLocation(location))
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}

export const updateBanner = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await admin_useCase.updateBanner(req))
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}

export const getPremiumUsers = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await admin_useCase.getPremiumUsers())
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}

export const cancelSubscription = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await admin_useCase.cancelSubscription(req.body))
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}

export const getDoungnutData = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await admin_useCase.getDoungnutData())
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}


export const getLastSubscriptions = async (req: Request, res: Response) => {
    try {
        const data = req.query.monthCount
        return res.status(200).json(await admin_useCase.getLastSubscriptions(Number(data)))
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: false })
    }
}