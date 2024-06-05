import { Request, Response } from "express";
import { chatUseCase } from "../../domain/useCases/chat_use_case";


const errorResponse = (error: any, res: Response) => {
    res.status(200).json({ status: false, message: error?.message ?? "some error occured" })
}

const successResponse = (res: Response, data?: any) => {
    res.status(200).json(data)
}

export const getChatOfUser = async (req: Request, res: Response) => {
    try {
        successResponse(res, await chatUseCase.getChatOfUser(req.query.userId as string))
    } catch (error: any) {
        console.error(error);
        errorResponse(error, res)
    }
}