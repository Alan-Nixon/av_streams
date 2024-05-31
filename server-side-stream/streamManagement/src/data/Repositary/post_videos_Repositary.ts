import { searchProfileGRPC } from "../../presentation/Grpc/stream_user";
import { getUserByIdRabbit } from "../../presentation/Rabbitmq/consumer";
import { CategoryModel } from "../Models/category";
import { PostModel } from "../Models/posts";
import { ReportModel } from "../Models/report";
import { VideoModel } from "../Models/videos";
import { postDataRepoInterface, post_video_repo_interface } from "../interfaces/postVideosInterface";
import { IReport } from "../interfaces/videoModelInterface";


class postVideosRepositary implements post_video_repo_interface {
    async uploadPostRepo(Data: postDataRepoInterface) {
        return await PostModel.insertMany(Data)
    }

    returnErrorCatch(message: any) {
        return { status: false, message: message ?? "error occured" }
    }

    async findChannelNameUsingId(userId: string) {
        return (await getUserByIdRabbit(userId))+"" 
    }

    async postVideosRepo(userId: string) {
        return await PostModel.find({ userId })
    }

    async deletePostRepo(postID: string) {
        await PostModel.findByIdAndDelete(postID)
        return null
    }

    async getAllPosts() {
        return await PostModel.find()
    }

    async likePost(postId: string, userId: string) {
        try {
            const post = await PostModel.findById(postId);
            if (post) {
                if (!post.likesArray.includes(userId)) {
                    post.likesArray.push(userId);
                    post.likes = (parseInt(post.likes) + 1).toString();
                    await post.save();
                } else {
                    post.likesArray.splice(post.likesArray.indexOf(userId), 1);
                    post.likes = (parseInt(post.likes) - 1).toString();
                    await post.save();
                }
            }
            return null
        } catch (error) {
            console.error("Error liking post:", error);
            throw error;
        }
    }
    async getPostFromUser(userId: string) {
        const data = await PostModel.find({ userId })
        return { status: true, message: "success", data }
    }

    async getUserVideos(userId: string, shorts: boolean) {
        const data = await VideoModel.find({ userId, shorts: shorts, Visiblity: true })
        return { status: true, message: "success", data }
    }

    async getAllVideos(isShorts: boolean) {
        const data = await VideoModel.find({ shorts: isShorts, Visiblity: true })
        return { status: true, message: "success", data }
    }

    async getVideosWithId(videoId: string) {
        return { status: true, message: "success", data: await VideoModel.findById(videoId) }
    }

    async getMostWatchedVideoUser(userId: string) {
        const data = await VideoModel.find({ userId, shorts: false, Visiblity: true })
        data.sort((a, b) => Number(b.Views) - Number((a.Views)))
        if (data.length > 8) { data.splice(0, 7) }
        return { status: true, message: "success", data }
    }

    async getPremiumVideos() {
        return { status: true, message: "success", data: await VideoModel.find({ shorts: false, Premium: true, Visiblity: true }) }
    }

    async searchVideosAndProfile(search: string) {
        const data = await VideoModel.find({
            $or: [
                { Title: { $regex: search, $options: 'i' } },
                { Description: { $regex: search, $options: 'i' } }
            ], Visiblity: true
        })

        const profile = JSON.parse((await searchProfileGRPC(search)).data as string)
        return { status: true, message: "success", data: [data, profile] }
    }

    async addReportSubmit(Data: IReport) {
        try {
            return { status: true, message: "success", data: await ReportModel.insertMany(Data) }
        } catch (error: any) {
            return { status: false, message: error.messsage ?? "" }
        }
    }

    async getReportsBySection(section: string) {
        try {
            return { status: true, message: "success", data: await ReportModel.find({ Section: section }) }
        } catch (error: any) {
            return { status: false, message: error.messsage ?? "" }
        }
    }

    async getBlockedVideos() {
        return { status: true, message: "success", data: await VideoModel.find({ Visiblity: false }) }
    }

    async blockContentVisiblity(LinkId: string, Section: string, reportId: string) {
        await ReportModel.findByIdAndUpdate(reportId, { Responded: true })

        if (Section === "video") {
            await VideoModel.findByIdAndUpdate(LinkId, {
                Visiblity: false,
            })
        } else if (Section === "post") {
            await PostModel.findByIdAndUpdate(LinkId, {
                Visiblity: false
            })
        }
        return { status: true, message: "success" }
    }

    async changeVisiblityContent(LinkId: string, Section: string) {

        if (Section === "video") {
            const video = await VideoModel.findById(LinkId)
            if (video) {
                video.Visiblity = !video.Visiblity
                await video.save()
            }
        } else if (Section === "post") {
            const post = await PostModel.findById(LinkId)
            if (post) {
                post.Visiblity = !post.Visiblity
                await post.save()
            }
        }

        return { status: true, message: "success" }
    }

    async getCategory() {
        return { status: true, message: "success", data: await CategoryModel.find() }
    }

    async blockcategory(cateId: string) {
        const cate = await CategoryModel.findById(cateId)
        if (cate) {
            cate.Display = !cate.Display;
            await cate.save()
            return { status: true, message: "successfully done the action", data: cate }
        } else {
            return { status: false, message: "error while updating", data: cate }
        }
    }

    async addCategory(Data: Object) {
        try {
            await CategoryModel.insertMany(Data);
            return { status: true, message: "success" }
        } catch (error: any) {
            return this.returnErrorCatch(error.message)
        }
    }

}

export const postVideosRepo: post_video_repo_interface = new postVideosRepositary()  