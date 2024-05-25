import axios from 'axios';
import { Request, Response } from 'express'

export const commentGetController = async (req: Request, res: Response) => {
    try {
        const data = await makeAGetReqInDjango(req)
        res.status(200).json({ status: true, data })
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })
    }
}

export const commentPostController = async (req: Request, res: Response) => {
    try {
        const data = await makeAPostReqInDjango(req)
        console.log(data);

        res.status(200).json({ status: true, data })
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })
    }
}

export const commentPatchController = async (req: Request, res: Response) => {
    try {
        const data = await makePatchRequest(req)
        console.log(data);
        res.status(200).json({ status: true, message: "success" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "error occured" })
    }
}


// helper functions  

const makeAGetReqInDjango = async (req: Request) => {
    try {
        const Route = req.params.Route
        const query = JSON.stringify(req.query)
        const { data } = await axios.get(process.env.COMMENTMANAGEMENT + Route + `/?query=${query}`, {
            headers: { "Authorization": req.headers.authorization }
        })
        data.data = JSON.parse(data.data)
        return data
    } catch (error) {
        console.error(error);
    }
}

const makeAPostReqInDjango = async (req: Request) => {
    try {
        const query = req.params.Route
        const { data } = await axios.post(process.env.COMMENTMANAGEMENT + query + "/", req.body, {
            headers: { "Authorization": req.headers.authorization }
        })
        return data
    } catch (error) {
        console.error(error)
        return false
    }
}


const makePatchRequest = async (req: Request) => {
    try {
        const query = req.params.Route
        const { data } = await axios.patch(process.env.COMMENTMANAGEMENT + query + "/", req.body, {
            headers: { "Authorization": req.headers.authorization }
        })
        return data
    } catch (error) {
        console.error(error)
        return false
    }
}