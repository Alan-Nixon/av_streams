import React, { Dispatch, ReactNode, SetStateAction } from "react";
declare global {
    interface Window {
        Swal: any
        Razorpay: any
    }
}


export const googleClientId = process.env.REACT_APP_CLIENT_ID
export const linkedClientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID
export const clientSideUrl = process.env.REACT_APP_CLIENT_SIDE_URL
export const RecaptchaSecret = process.env.REACT_APP_RECAPTCHA_KEY


export type SetProgressFunction = Dispatch<SetStateAction<number>>;
export type changeEvent = React.ChangeEvent<HTMLInputElement>




export interface Data {
    _id?: string;
    userName: string;
    FullName: string;
    Email: string;
    Password: string;
    isAdmin?: boolean;
    isBlocked?: boolean;
    profileImage?: string;
    channelName?: string;
    Phone: number | string;
}




export interface channelInterface {
    _id: string,
    userId: string,
    userName: string,
    channelName: string,
    profileImage: string,
    Followers: string[]
    Streams: string[] | []
    Videos: string[] | []
    Shorts: string[] | [],
    channelDescription: "",
    isFollowing: boolean,
    subscription: SubscriptionInterfaceDataSuccess | {}
}

export interface subBannerInterface {
    _id: string
    Thumbnail: string,
}

export interface captchaPropsInterface {
    showCaptcha: Dispatch<SetStateAction<boolean>>;
    validate: (from: boolean) => void;
}

export interface BannerInterfaceHome {
    bigBanner: string,
    mainBanner: videoInterface,
    subBanners: videoInterface[]
}

export interface linkedInComponenetProps {
    onSuccess: (response: any) => void;
    onError: (error: any) => void;
}


export interface loginData {
    Email: string;
    Password: string
}

export interface NavBarProps {
    isHome?: boolean;
}

export interface ContentProps {
    children: ReactNode;
}

export interface UserContextValue {
    user: Data | null;
    setUserData: (userData: Data) => void;
    showHideSideBar: boolean,
    setShowHideSideBar: Dispatch<SetStateAction<boolean>>;
}

export interface socketContextInterface {
    socket: any
    setSocket: any
}

export interface adminSession {
    isSession: ReactNode
    noSession: ReactNode
}

export interface result {
    status: boolean;
    message: string;
    token?: string
}

export interface createUser {
    Email: string,
    Password: string,
    confirmPassword: string,
    FullName: string,
    userName: string,
    Phone: string,
    isAdmin: boolean
}

export interface Transaction {
    amount: number;
    credited: boolean;
    createdTime: string;
    transactionId: string;
}

export interface WalletDetails {
    _id: string,
    userId: string,
    userName: string,
    Balance: number;
    Transactions?: Transaction[];
}

export interface FollowersDetailsArray {
    _id: string,
    channelId: string,
    userName: string,
    Email: string,
    profileImage: string,
}

export interface FollowFollowersTypeData {
    title: string,
    data: FollowersDetailsArray[],
    action: string
}

export interface commentInterface {
    _id: string
    userName: string,
    Comment: string,
    Section: string
    LinkId: string,
    profileImage: string,
    likedUsers: [string] | [],
    isUserLiked: boolean,
    Replies?: { userName: string; Reply: string; }[];
}
export interface CommentProps {
    CommentsArray: commentInterface[];
    Section: string;
    LinkId: string;
    indexKey: string;
    incComm?: (key: number, comm: commentInterface) => null;
}

export interface videoInterface {
    _id: string,
    userId: string,
    Title: string,
    channelName: string,
    Visiblity: boolean,
    likesArray?: string[],
    Description: string,
    Link: string,
    shorts: boolean,
    Premium: boolean,
    Thumbnail: string,
    Category: string
}

export interface postInterface {
    _id: string,
    Title: string,
    Description: string,
    postLink: string,
    userId: string,
    channelName: string,
    profileLink: string,
    likes: string,
    likesArray?: string[],
    dislikes: string,
    Time: string
    clicked?: boolean;
    liked?: boolean;
    Comments: commentInterface[]
}


export interface responseIntefraceImage {
    status: boolean,
    message: string,
    url: string
}



interface channelDetailsVideo {
    channelLogo: string,
    channelName: string,
    count: string,
    isFollowing: boolean
}

export interface videoInterfaceComment {
    Title: string,
    videolink: string,
    Thumbnail: string
    channelDetails: channelDetailsVideo,
    clicked?: boolean
}

export interface postInterfaceUpload {
    Title: string,
    Description: string,
    PostImage: File | null
}

export interface propsComment {
    userId: string,
    Comment: string,
    profileImage: string;
    LinkId: string;
    Section: string
}

export interface ReplyCommentInterface {
    userName: string,
    profileImage: string,
    Reply: string,
    commentId: string
}

export interface ChakraInterface {
    message: string
}


export interface RazorpayInterface {
    successPayment: (response: any) => void,
    errorPayment: (error: any) => void,
    Amount: number
}

export interface paginationInterface {
    pagination: any,
    maxCount: number,
    paginationFunc: (next: boolean) => null,
    Data: videoInterface[] | Transaction[]
}

export interface ModalInterfaceStateSetState {
    visible: boolean;
    setVisible: any
}

export interface subscriptionInterface {
    section: string;
    price: number
}

export interface SubscriptionInterfaceDataSuccess {
    expires: string,
    section: string,
    paymentId: string,
    userId: string,
    email: string,
    amount: number
}

export interface carouselInterface {
    imgUrl: string
}

export interface tableInterfaceData {
    rowsData: any[],
    columnsData: any[]
}

export interface bannerInterface {
    _id: string
    imgUrl: string;
    location: string;
}

export interface chatsInterface {
    _id: string,
    userId: string[];
    details: messageArray[];
    archived: boolean;
}

export type messageArray = {
    to: string,
    time: string,
    sender: string,
    message: string,
    file: {
        fileType: string,
        Link: string,
    },
    seen: boolean
}



export interface confirmToastInterface {
    onConfirm: () => void,
    onCancel: () => void,
    text?: string
}

export interface showConfirmationToastInterface {
    onConfirm: () => {}
}


export interface chatHomeIterface {
    singleChatopen: (personDetails: any) => void
    userDetails: Data
}

export type reportDialogInterface = {
    submitReport: (text: string) => void,
    closeFunc: Dispatch<SetStateAction<boolean>>
}

export type reportType = {
    _id: string,
    channelName: string,
    userId: string,
    Link: string,
    LinkId: string,
    Section: string,
    Reason: string,
    Responded: boolean,
    Blocked: boolean
}

export type categoryInterface = {
    _id: string,
    categoryName: string,
    Description: string
    videosCount: string
    postCount: string
    Display: boolean
}

export type VideoData = {
    _id: string,
    Link: string;
    Thumbnail: string;
    clicked: boolean;
    Title?: string;
    videolink?: string;
    likesArray: string[],
    channelDetails?: {
        channelLogo: string;
        channelName: string;
        count: string;
        isFollowing: boolean;
    };
}

export type messageDetails = {
    _id: string
    seen: boolean
    sender: string,
    time: string,
    to: string
}

export type chatHomeUsers = {
    _id: string,
    file: { fileType: string, Link: string }
    archived: boolean,
    details: messageDetails[],
    personDetails: channelInterface,
    personId: string
}

export type singleChatInterfce = {
    setChatHome: Dispatch<SetStateAction<boolean>>
    personDetails: channelInterface
    messages: messageArray[]
    setMessages: Dispatch<SetStateAction<messageArray[]>>
    messageSocket: any
    zp: any
}



export interface chatInterfaceProps {
    chatWindow: boolean;
    setChatWindow: React.Dispatch<React.SetStateAction<boolean>>
    user: Data;
    messageSocket: any;
    zp: any
}

export type dongnutTypeData = {
    completeText: string,
    remainingText: string,
    completedPercentage: number,
    remainingPercentage: number
}

export type dongnutInterface = {
    headtext: string,
    dongnutData: dongnutTypeData
}

export type chartType = {
    heading: string,
    months: string[],
    data: number[]
}

export type liveDetails = {
    Title: string, Description: string, Thumbnail: null | File
}