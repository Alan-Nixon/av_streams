import { deleteImageFromCloudinary, findImageByPublicId, getPublicIdFromUrlCloudinary, uploadImage } from "../../../data/Adapters/cloudinary";
import { postVideosRepo } from "../../../data/Repositary/post_videos_Repositary";
import { ImageData } from "../../../data/interfaces/cloundinaryInterface";
import { getTokenFromRequest, getDataFromToken } from 'userauthenticationforavstreams'
import { payload, postDataInterface, postFilesnFeilds, videoPostInterface } from "../../interfaces/video_post_interface/videoPostInterface";
import { Request } from 'express'
import { getProfileLink, uploadVideoGRPC } from "../../../presentation/Grpc/stream_user";
import { VideoModel } from "../../../data/Models/videos";
import { IReport } from "../../../data/interfaces/videoModelInterface";

class videoPostUseCase implements videoPostInterface {
    async uploadPost(Data: any, user: payload) {
        try {
            const data = await uploadImage(Data.files.PostImage[0] as unknown as ImageData, "avstreamPosts")
            const channelName: string = await postVideosRepo.findChannelNameUsingId(user.id)
            console.log(channelName, "we got channelName");

            const sendData: postDataInterface = {
                Title: Data.fields.Title[0],
                Description: Data.fields.Description[0],
                postLink: data.url,
                userId: user.id,
                channelName,
                Time: new Date().toString(),
                likes: "0",
                dislikes: "0"
            };
            const insertedData = await postVideosRepo.uploadPostRepo(sendData)
            return insertedData ? { status: true, message: "successfully uploaded post" } : { status: false, message: "database not available" }
        } catch (error) {
            return { status: false, message: "error occured when uploading post" }
        }
    }

    async getAllpostOfUser(req: Request) {
        try {
            const data = getDataFromToken(getTokenFromRequest(req) || "") as payload;
            const posts = await postVideosRepo.postVideosRepo(data.id)
            return { status: true, message: "success", data: posts }
        } catch (error) {
            console.error(error)
            return { status: false, message: "error" }
        }
    }

    async deletePostUseCase(link: string, postId: string) {
        try {
            const imageId = getPublicIdFromUrlCloudinary(link)
            await deleteImageFromCloudinary(imageId + "")
            await postVideosRepo.deletePostRepo(postId)
            return { status: true, message: "success" }
        } catch (error) {
            console.error(error);
            return { status: false, message: "error" }
        }
    }

    async getAllPosts() {
        try {
            const posts = JSON.parse(JSON.stringify(await postVideosRepo.getAllPosts()));

            for (const item of posts) {
                const profileLink = await getProfileLink(item.userId);
                item.profileLink = profileLink;
                item.clicked = false
                item.Comments = []
            }

            return { status: true, message: "success", data: posts }
        } catch (error) {
            console.error(error);
            return { status: false, message: "error" }
        }
    }

    async likePost(postId: string, userId: string) {
        try {
            await postVideosRepo.likePost(postId, userId)
            return { status: true, message: "success" }
        } catch (error) {
            console.error(error);
            return { status: false, message: "error" }
        }
    }

    async getPostFromUser(userId: string) {
        return await postVideosRepo.getPostFromUser(userId)
    }

    async uploadVideo(data: any) {
        try {
            const thumbnail = data.files.thumbnail[0]
            const videoData = JSON.parse(data.fields?.videoData[0])
            const { url } = await uploadImage(thumbnail, 'avstreamThumbnail')
            delete videoData._id;
            videoData.Thumbnail = url
            videoData.likesArray = [];
            videoData.likes = "0";
            videoData.dislikes = "0";
            videoData.Time = new Date().toString()
            await VideoModel.insertMany(videoData)
            return await uploadVideoGRPC({
                userId: videoData.userId,
                Link: videoData.Link,
                Thumbnail: videoData.Thumbnail,
                shorts: videoData.shorts
            })
        } catch (error: any) {
            console.log(error)
            return { status: false, message: error.message }
        }
    }

    async getUserVideos(req: Request) {
        try {
            const data = getDataFromToken(getTokenFromRequest(req) || "") as payload
            const val = req.query.shorts
            return await postVideosRepo.getUserVideos(data.id, val === "false" ? false : true)
        } catch (error: any) {
            console.log(error)
            return { status: false, message: error.message }
        }
    }

    async getAllVideos(shorts: boolean) {
        try {
            return await postVideosRepo.getAllVideos(shorts)
        } catch (error) {
            console.log(error);
            return { status: false, message: "error occured" }
        }
    }

    async getVideosWithId(req: Request) {
        try {
            const videoId: any = req.query.videoId
            return await postVideosRepo.getVideosWithId(videoId)
        } catch (error) {
            console.log(error)
            return { status: false, message: "error occured" }
        }
    }

    async getMostWatchedVideoUser(userId: string) {
        try {
            return postVideosRepo.getMostWatchedVideoUser(userId)
        } catch (error) {
            console.error(error);
            return { status: false, message: "failed" }
        }
    }

    async getPremiumVideos() {
        try {
            return postVideosRepo.getPremiumVideos()
        } catch (error) {
            console.error(error);
            return { status: false, message: "failed" }
        }
    }

    async searchVideosAndProfile(search: string) {
        try {
            return postVideosRepo.searchVideosAndProfile(search)
        } catch (error) {
            console.error(error);
            return { status: false, message: "failed" }
        }
    }

    async addReportSubmit(Data: IReport) {
        try {
            return postVideosRepo.addReportSubmit(Data)
        } catch (error) {
            console.error(error);
            return { status: false, message: "failed" }
        }
    }

    async getReportsBySection(section: string) {
        try {
            return postVideosRepo.getReportsBySection(section)
        } catch (error) {
            console.error(error);
            return { status: false, message: "failed" }
        }
    }

    async getBlockedVideos() {
        return await postVideosRepo.getBlockedVideos()
    }

    async blockContentVisiblity(LinkId: string, Section: string, reportId: string) {
        return await postVideosRepo.blockContentVisiblity(LinkId, Section, reportId)
    }

    async changeVisiblityContent(LinkId: string, Section: string) {
        return await postVideosRepo.changeVisiblityContent(LinkId, Section)
    }

    async getCategory() {
        return await postVideosRepo.getCategory()
    }

    async blockcategory(cateId: string) {
        return await postVideosRepo.blockcategory(cateId)
    }

    async addCategory(Data: Object) {
        return await postVideosRepo.addCategory({ ...Data, videosCount: [], postCount: [], Display: true })
    }

    async getPostDongnutData(userCount: number) {
        const postLength = (await postVideosRepo.getAllPosts())?.length || 0
        const data = {
            completeText: "users with post",
            remainingText: "users who don't have post",
            completedPercentage: Math.floor((postLength * 100) / userCount),
            get remainingPercentage() { return 100 - this.completedPercentage }
        }
        return { status: true, message: "success", data }
    }

    async getCurrentLives() { 
        return await  postVideosRepo.getCurrentLives()
    }

    async getVideosByUserId(shorts:string,userId:string) {
        return await postVideosRepo.getVideosByUserId(shorts,userId)
    }

    async videoLike(videoId:string,userId:string) {
        return await postVideosRepo.videoLike(videoId,userId)
    }

}

export const videoPost: videoPostInterface = new videoPostUseCase()

