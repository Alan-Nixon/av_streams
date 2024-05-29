import axios from 'axios';
import { Request, Response } from 'express'
import { Fields, Files } from 'formidable';
import { IncomingForm } from 'formidable';

const userUrl: string = process.env.USERMANAGEMENT || ""

const sendResponse = (res: Response, statusCode: number, Data: any) => {
    return res.status(statusCode).json(Data)
}

export const userManagement_get = async (req: Request, res: Response) => {
    try {
        if (req.headers.authorization?.split(' ')[1] !== 'undefined') {
            makeGetRequest(req, res)
        } else {
            sendResponse(res, 304, { status: false, message: "no token found sorry" })
        }
    } catch (error) {
        console.error(error)
    }
}

export const userManagement_Post = async (req: Request, res: Response) => {
    try {
        if (req.headers['content-type']?.split(' ')[0] === "multipart/form-data;") {
            const body = await multipartFormSubmission(req)
            makePostRequest(req, res, body)
        } else {
            makePostRequest(req, res, req.body)
        }
    } catch (error) {
        console.error(error)
    }
}


export const userManagement_Patch = async (req: Request, res: Response) => {
    try {
        if (req.headers['content-type']?.split(' ')[0] === "multipart/form-data;") {
            const body = await multipartFormSubmission(req)
            makePacthRequest(req, res, body)
        } else {
            makePacthRequest(req, res, req.body)
        }
    } catch (error) {
        console.error(error)
    }
}




//  helper functions

async function makeGetRequest(req: Request, res: Response) {
    try {
        const query = JSON.stringify(req.query);

        const response = await axios.get(userUrl + req.params.Route + `?query=${query}`, {
            headers: { 'Authorization': req.headers.authorization }
        });

        if (response.status === 204) {
            console.log("blocked aanu");
            return res.status(204).json({ status: false, message: "Blocked" })
        }
        if (response.data.message === "access token expired") {
            console.log("user is not authenticated");
            const newTokenResponse = await axios.post(userUrl + "regenerateToken", {}, {
                headers: { 'Authorization': req.headers.authorization }
            });
            sendResponse(res, 403, newTokenResponse.data);
        } else {
            sendResponse(res, 200, response.data);
        }
    } catch (error: any) {
        console.log(error);
        
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized error occurre", req.params.Route);
            sendResponse(res, 204, { message: "Unauthorized", user: "isAdminAuth" ? false : true });
        } else {
            console.error("Error occurred:", error);
            sendResponse(res, 500, { message: "Internal Server Error" });
        }
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


async function makePostRequest(req: Request, res: Response, body: any) {
    try {
        const { data } = await axios.post(userUrl + req.params.Route, body, {
            headers: { "Authorization": req.headers.authorization }
        })
        sendResponse(res, 200, data)
    } catch (error: any) {
        sendResponse(res, 500, { message: error.message || "internal server error" })
    }
}

async function makePacthRequest(req: Request, res: Response, body: any) {
    let query = ""
    if (req.query) { query = JSON.stringify(req.query) }
    const { data } = await axios.patch(userUrl + req.params.Route + `?query=${query}`, body, {
        headers: { "Authorization": req.headers.authorization }
    })
    sendResponse(res, 200, data)
}
