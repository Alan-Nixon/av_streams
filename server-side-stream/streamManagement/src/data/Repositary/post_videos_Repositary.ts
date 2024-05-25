import { GetChannelNameFunction, searchProfileGRPC } from "../../presentation/Grpc/stream_user";
import { PostModel } from "../Models/posts";
import { VideoModel } from "../Models/videos";
import { postDataRepoInterface, post_video_repo_interface } from "../interfaces/postVideosInterface";


class postVideosRepositary implements post_video_repo_interface {
    async uploadPostRepo(Data: postDataRepoInterface) {
        return await PostModel.insertMany(Data)
    }

    async findChannelNameUsingId(userId: string) {
        return await GetChannelNameFunction(userId)
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
        const data = await VideoModel.find({ userId, shorts: shorts })
        return { status: true, message: "success", data }
    }

    async getAllVideos(isShorts: boolean) {
        const data = await VideoModel.find({ shorts: isShorts })
        return { status: true, message: "success", data }
    }

    async getVideosWithId(videoId: string) {
        return { status: true, message: "success", data: await VideoModel.findById(videoId) }
    }

    async getMostWatchedVideoUser(userId: string) {
        const data = await VideoModel.find({ userId, shorts: false })
        data.sort((a, b) => Number(b.Views) - Number((a.Views)))
        if (data.length > 8) { data.splice(0, 7) }
        return { status: true, message: "success", data }
    }

    async getPremiumVideos() {
        return { status: true, message: "success", data: await VideoModel.find({ shorts: false, Premium: true }) }
    }

    async searchVideosAndProfile(search: string) {
        const data = await VideoModel.find({
            $or: [
                { Title: { $regex: search, $options: 'i' } },
                { Description: { $regex: search, $options: 'i' } }
            ]
        })

        const profile = JSON.parse((await searchProfileGRPC(search)).data as string)
        return { status: true, message: "success", data: [data, profile] }
    }
}

export const postVideosRepo: post_video_repo_interface = new postVideosRepositary()  