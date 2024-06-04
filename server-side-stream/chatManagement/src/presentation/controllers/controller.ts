import { Request, Response } from "express";


const errorResponse = (error: any, res: Response) => {
    res.status(200).json({ status: false, message: error?.message ?? "some error occured" })
}

const successResponse = (res: Response, data?: any) => {
    res.status(200).json({ status: true, message: "success", data })
}

export const getChatOfUser = async (req: Request, res: Response) => {
    try {
        console.log(req.query);
        successResponse(res)
    } catch (error: any) {
        console.error(error);
        errorResponse(error, res)
    }
}