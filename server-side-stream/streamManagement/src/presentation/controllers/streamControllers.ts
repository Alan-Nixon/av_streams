import { Request, Response } from "express"
import { videoPost } from "../../domain/usecases/video_post_use_cases/video_post_usecase"
import { payload } from "../../domain/interfaces/video_post_interface/videoPostInterface"
import { getDataFromToken, getTokenFromRequest } from "userauthenticationforavstreams"
import { generateName } from 'user_random_name_generator'
import { Fields, Files, IncomingForm } from 'formidable'


export const stopStream = async (req: Request, res: Response) => {
    res.status(200).json({})
}

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const data = await multipartFormSubmission(req)
        if (data) {
            res.status(200).json(await videoPost.uploadVideo(data))
        } else {
            res.status(500).json({ status: false, message: "req.body not found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })
    }
}

export const uploadPost = async (req: Request, res: Response) => {
    try {
        const data = await multipartFormSubmission(req)
        res.status(200).json(await videoPost.uploadPost(data, req.user as payload))
    } catch (error) {
        console.error(error);

    }
}

export const getAllpostOfUser = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.getAllpostOfUser(req))
    } catch (error) {
        console.error(error)
    }
}

export const deletePostFromCloudinary = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.deletePostUseCase(req.body.link, req.body.postId))
    } catch (error) {
        console.error(error);
    }
}

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const Data = await videoPost.getAllPosts()
        res.status(200).json(Data)
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false })
    }
}

export const likePost = async (req: Request, res: Response) => {
    try {
        const data: any = getDataFromToken(getTokenFromRequest(req) || "")
        res.status(200).json(await videoPost.likePost(req.body.postId, data.id))
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false })
    }
}

export const getPostFromUser = async (req: Request, res: Response) => {
    try {
        const { userId }: any = req.query
        const data = await videoPost.getPostFromUser(userId)
        res.status(200).json(data)
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" })
    }
}

export const getName = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ status: true, data: await generateName() })
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || "internal server error" })
    }
}

export const getUserVideos = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.getUserVideos(req))
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message || "internal server error" })
    }
}

export const getAllVideos = async (req: Request, res: Response) => {
    try {
        const isShorts = req.query.shorts === "false" ? false : true
        res.status(200).json(await videoPost.getAllVideos(isShorts))
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getVideosWithId = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.getVideosWithId(req))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}


export const getMostWatchedVideoUser = async (req: Request, res: Response) => {
    try {
        const userId: any = req.query.userId
        res.status(200).json(await videoPost.getMostWatchedVideoUser(userId))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}


export const getPremiumVideos = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.getPremiumVideos())
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}


export const searchVideosAndProfile = async (req: Request, res: Response) => {
    try {
        const search: any = req.query.search
        res.status(200).json(await videoPost.searchVideosAndProfile(search))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}


export const addReportSubmit = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.addReportSubmit(req.body))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getReportsBySection = async (req: Request, res: Response) => {
    try {
        const section: any = req.query.Section
        res.status(200).json(await videoPost.getReportsBySection(section))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getBlockedVideos = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.getBlockedVideos())
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const blockContentVisiblity = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.blockContentVisiblity(req.body.LinkId, req.body.Section, req.body.reportId))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const changeVisiblityContent = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.changeVisiblityContent(req.body.LinkId, req.body.Section))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getCategory = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.getCategory())
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const blockcategory = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.blockcategory(req.body.cateId))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const addCategory = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.addCategory(req.body))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}

export const getPostDongnutData = async (req: Request, res: Response) => {
    try {
        const count: any = req.query.userCount;
        res.status(200).json(await videoPost.getPostDongnutData(Number(count)))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}



export const getCurrentLives = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await videoPost.getCurrentLives())
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}


export const getVideosByUserId = async (req: Request, res: Response) => {
    try {
        const { shorts, userId } = req.query
        res.status(200).json(await videoPost.getVideosByUserId(shorts, userId ))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
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