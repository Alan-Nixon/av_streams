import axios from 'axios';
import { Request, Response } from 'express'
import { Fields, Files, IncomingForm } from 'formidable'

const streamUrl: string = process.env.STREAMANAGEMENT || ""


export const streamGetController = async (req: Request, res: Response) => {
    try {
        if (req.headers.authorization?.split(' ')[1] !== 'undefined') {
            const query = JSON.stringify(req.query)
            console.log(streamUrl+req.params.Route);
            
            const { data } = await axios.get(streamUrl + req.params.Route + `?query=${query}`, {
                headers: { 'Authorization': req.headers.authorization }
            })
            res.status(200).json(data)
        } else {
            res.status(200).json({ status: false, message: "no token found sorry" })
        }
    } catch (error) {
        console.error(error)
    }
}

export const streamPostController = async (req: Request, res: Response) => {
    try {
        if (req.headers['content-type']?.split(' ')[0] === "multipart/form-data;") {
            const form = new IncomingForm();
            form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
                if (err) {
                    console.log(err);
                    return res.status(200).json({ status: false });
                } else {
                    try {
                        console.log(files, req.params.Route)
                        const { data } = await axios.post(streamUrl + req.params.Route, { files, fields }, {
                            headers: {
                                "Authorization": req.headers.authorization
                            }
                        });
                        res.status(200).json(data);
                    } catch (error) {
                        console.error('Error making POST request:', error);
                        res.status(500).json({ status: false, error: 'An error occurred while making the request' });
                    }
                }
            });
        } else {
            const { data } = await axios.post(streamUrl + req.params.Route, req.body,{
                headers:{'Authorization':req.headers.authorization}
            })
            res.status(200).json(data)
        }
    } catch (error) {
        console.error(error)
    }
}

export const streamDeleteController = async (req: Request, res: Response) => {
    try {
        if (req.headers.authorization?.split(' ')[1] !== 'undefined') {
            const query = JSON.stringify(req.query)
            const { data } = await axios.delete(streamUrl + req.params.Route + `?query=${query}`, {
                headers: { 'Authorization': req.headers.authorization },
                data: req.body
            })
            res.status(200).json(data)
        } else {
            res.status(304).json({ status: false, message: "no token found sorry" })
        }
    } catch (error) {
        console.error(error)
    }
}

export const streamPatchController = async (req: Request, res: Response) => {
    try {
        console.log(req.headers.authorization);

        if (req.headers.authorization) {
            const query = JSON.stringify(req.query);
            const { data } = await axios.patch(streamUrl + req.params.Route + `?query=${query}`, req.body, {
                headers: { 'Authorization': req.headers.authorization }
            });
            res.status(200).json(data);
        } else {
            res.status(304).json({ status: false, message: "no token found sorry" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
};
