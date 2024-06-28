import { responseObject } from "../../domain/interfaces/video_post_interface/videoPostInterface";
import { IPost } from "./postModelInterface";
import { IReport } from "./videoModelInterface";

export interface postDataRepoInterface {
    Title: string,
    Description: string,
    Time: string,
    userId: string,
    postLink: string,
    likes: string,
    dislikes: string
}

export interface post_video_repo_interface {
    uploadPostRepo(Data: postDataRepoInterface): Promise<IPost[]>;
    findChannelNameUsingId(userId: string): Promise<string>;
    postVideosRepo(userId: string): Promise<IPost[]>;
    deletePostRepo(userId: string): Promise<null>;
    getAllPosts(): Promise<IPost[]>;
    likePost(postId: string, userId: string): Promise<null>;
    getPostFromUser(userId: string): Promise<responseObject>;
    getUserVideos(userId: string, shorts: boolean): Promise<responseObject>;
    getAllVideos(isShorts: boolean): Promise<responseObject>;
    getVideosWithId(videoId: string): Promise<responseObject>;
    getMostWatchedVideoUser(userId: string): Promise<responseObject>;
    getPremiumVideos(): Promise<responseObject>;
    searchVideosAndProfile(search: string): Promise<responseObject>;
    addReportSubmit(Data: IReport): Promise<responseObject>;
    getReportsBySection(section: string): Promise<responseObject>;
    getBlockedVideos(): Promise<responseObject>;
    blockContentVisiblity(LinkId: string, Section: string, reportId: string): Promise<responseObject>;
    changeVisiblityContent(LinkId: string, Section: string): Promise<responseObject>;
    getCategory(): Promise<responseObject>;
    blockcategory(cateId: string): Promise<responseObject>;
    addCategory(Data: Object): Promise<responseObject>;
    returnErrorCatch(message: any): responseObject;
    getCurrentLives(): Promise<responseObject>;
    getVideosByUserId(shorts: string,userId:string): Promise<responseObject>;
    videoLike(videoId:string,userId:string): Promise<responseObject>;
    editVideoDetails(videoDetails:Object):Promise<responseObject>;
}