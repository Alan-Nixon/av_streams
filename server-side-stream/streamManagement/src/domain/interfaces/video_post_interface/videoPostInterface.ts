import { Request } from 'express'
import { IReport } from '../../../data/interfaces/videoModelInterface'


export interface postFilesnFeilds {
    fields: { Title: string, Description: string },
    files: { PostImage: File[] }
}

export interface payload {
    id: string,
    username: string,
    isAdmin: boolean,
    email: string,
    iat: number
}

export interface postDataInterface {
    Title: string,
    Description: string,
    Time: string,
    userId: string,
    channelName: string,
    postLink: string,
    likes: string,
    dislikes: string
}

export interface responseObject {
    status: boolean,
    message: string,
    data?: any
}

export interface videoPostInterface {
    uploadPost(Data: any, user: payload): Promise<responseObject>;
    getAllpostOfUser(req: Request): Promise<responseObject | null>;
    deletePostUseCase(link: string, postLink: string): Promise<responseObject>;
    getAllPosts(): Promise<responseObject>;
    likePost(postId: string, userId: string): Promise<responseObject>;
    getPostFromUser(userId: string): Promise<responseObject>
    uploadVideo(data: any): Promise<responseObject>;
    getUserVideos(req: Request): Promise<responseObject>;
    getAllVideos(shorts: boolean): Promise<responseObject>;
    getVideosWithId(req: Request): Promise<responseObject>;
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
    getPostDongnutData(userCount:number): Promise<responseObject>;
} 