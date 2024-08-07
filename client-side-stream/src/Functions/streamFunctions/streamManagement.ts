import { axiosApiGateWay, calculateProgress, getTokenCookie } from "../commonFunctions";
import { SetProgressFunction, postInterfaceUpload, reportType, videoInterface } from "../interfaces";


export const sendStopRequest = async () => {
    const { data } = await axiosApiGateWay('/streamManagement/stopStream')
    return data
}

export const uploadVideo = async (videoData: Object, Thumbnail: File) => {
    try {
        const formData = new FormData();
        formData.append('thumbnail', Thumbnail);
        formData.append('videoData', JSON.stringify(videoData))
        const { data } = await axiosApiGateWay.post('/streamManagement/uploadVideo', formData, {
            headers: {
                Authorization: getTokenCookie(),
                'Content-Type': 'multipart/form-data;',
            }
        });
        return data
    } catch (error) {
        console.error(error);
    }
};

export const uploadPost = async (postData: postInterfaceUpload, setProgress: SetProgressFunction) => {
    const formData = new FormData()
    if (postData.PostImage) { formData.append('PostImage', postData.PostImage) }
    formData.append('Title', postData.Title)
    formData.append('Description', postData.Description)

    const { data } = await axiosApiGateWay.post('/streamManagement/uploadPost', formData, {
        headers: {
            Authorization: getTokenCookie(),
            'Content-Type': 'multipart/form-data;',
        },
        onUploadProgress: (progressEvent) => {
            calculateProgress(progressEvent, setProgress)
        }
    });

    return data
}


export const getAllpostOfUser = async () => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getAllpostOfUser')
    return data
}


export const deletePostFromCloudinary = async (link: string, postId: string) => {
    try {
        const { data } = await axiosApiGateWay.delete('/streamManagement/deletePostFromCloudinary', {
            data: { link, postId }
        });
        return data;
    } catch (error) {
        console.error('Error deleting post from Cloudinary:', error);
        throw error;
    }
}

export const getAllPosts = async () => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getAllPosts')
    return data?.data || []
}

export const getPostFromUser = async (userId: string) => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getPostFromUser?userId=' + userId)
    return data?.data || []
}


export const generateName = async () => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getName')
    return data.data ?? "NONAME " + Date.now()
}

export const getUserVideos = async (shorts: boolean) => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getUserVideos?shorts=' + shorts)
    return data?.data ?? []
}

export const getAllVideos = async (shorts: boolean, Cate: string) => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getAllVideos?shorts=' + shorts);
    if (Cate !== "" && data?.data.length > 0) {
        const Data = data.data.filter((item: any) => item?.Category === Cate);
        return Data
    } else {
        return data?.data ?? []
    }
}

export const getVideosWithId = async (videoId: string) => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getVideosWithId?videoId=' + videoId)
    return data.data
}

export const getMostWatchedVideoUser = async (userId: string) => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getMostWatchedVideoUser?userId=' + userId)
    return data.data
}

export const getPremiumVideos = async () => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getPremiumVideos')
    return data ?? { data: [] }
}

export const searchVideosAndProfile = async (search: string) => {
    const { data } = await axiosApiGateWay.get('/streamManagement/searchVideosAndProfile?search=' + search)
    return data ?? []
}

export const addReportSubmit = async (Data: reportType) => {
    const DataToSend = JSON.parse(JSON.stringify(Data)); delete DataToSend._id
    const { data } = await axiosApiGateWay.post('/streamManagement/addReportSubmit', Data)
    return data
}

export const getCurrentLives = async () => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getCurrentLives')
    return data ?? { data: [] }
}


export const getVideosByUserId = async (userId: string, shorts: boolean) => {
    const { data } = await axiosApiGateWay.get('/streamManagement/getVideosByUserId?shorts=' + shorts + '&userId=' + userId)
    return data
}


export const videoLike = async (videoId: string, userId: string) => {
    const { data } = await axiosApiGateWay.post('/streamManagement/videoLike', { videoId, userId })
    return data
}

export const editVideoDetails = async (videoDetails: videoInterface) => {
    const { data } = await axiosApiGateWay.post('/streamManagement/editVideoDetails', videoDetails, {
        headers: {
            "Content-Type": typeof videoDetails.Thumbnail === "string" ? "application/json" : "multipart/form-data"
        }
    })
    return data
}