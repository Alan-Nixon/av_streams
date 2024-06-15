import { Request, Response } from "express";
import { chatUseCase } from "../../domain/useCases/chat_use_case";
import { Fields, Files, IncomingForm } from 'formidable'


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

export const saveAudio = async (req: Request, res: Response) => {
    try {
        const data = await multipartFormSubmission(req)
        const message = data.fields.message ? JSON.parse(data.fields.message[0] as string) : null
        const audioBuffer = data.files.audioBuffer
        if (message && data.files.audioBuffer) {
            successResponse(res, await chatUseCase.saveAudio(message, audioBuffer))
        } else {
            errorResponse({ message: "not enough data" }, res);
        }
    } catch (error: any) {
        console.error(error);
        errorResponse(error, res)
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