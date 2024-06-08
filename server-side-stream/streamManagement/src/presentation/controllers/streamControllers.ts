import { Request, Response } from "express"
import { videoPost } from "../../domain/usecases/video_post_use_cases/video_post_usecase"
import { payload } from "../../domain/interfaces/video_post_interface/videoPostInterface"
import { getDataFromToken, getTokenFromRequest } from "userauthenticationforavstreams"
import { generateName } from 'user_random_name_generator'


export const stopStream = async (req: Request, res: Response) => {
    res.status(200).json({})
}

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        if (req.body.files) {
            res.status(200).json(await videoPost.uploadVideo(req))
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
        res.status(200).json(await videoPost.uploadPost(req.body, req.user as payload))
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
        const { userId } = JSON.parse(req.query.query as string)
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
        const isShorts = JSON.parse(req.query.query as string).shorts === "false" ? false : true
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
        const userId = JSON.parse(req.query.query as string).userId
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
        const search = JSON.parse(req.query.query as string).search
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
        const section = JSON.parse(req.query.query as string).Section
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
        const count = JSON.parse(req.query.query as string).userCount;
        res.status(200).json(await videoPost.getPostDongnutData(Number(count)))
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ status: false, message: error.message || "internal server error" })
    }
}