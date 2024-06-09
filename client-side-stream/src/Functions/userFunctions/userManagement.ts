import Cookies from "js-cookie";
import { Data, SubscriptionInterfaceDataSuccess, loginData } from "../interfaces";
import axios from 'axios'
import { axiosApiGateWay, getTokenCookie } from "../commonFunctions";


export const PostLogin = async (userData: loginData) => {
    const { data } = await axiosApiGateWay.post('/userManagement/postLogin', userData)
    if (data.status === 200) {
        return { status: true, message: "success", userData: data.userData, token: data.token }
    } else if (data.status === 201) {
        return { status: false, message: "sorry user is blocked" }
    } else if (data.status === 202) {
        return { status: false, message: "password does not match" }
    } else if (data.status === 203) {
        return { status: false, message: "user not found" }
    }
    return data
}

export const sendOtp = async (Email: string) => {
    try {
        const { data } = await axiosApiGateWay.get(`/userManagement/sendOtp?email=${Email}`, {
            headers: { Authorization: "dont need authorization" }
        })
        return data?.otp
    } catch (error) {

    }
}
export const postSignup = async (postData: Data) => {
    try {
        const { data } = await axiosApiGateWay.post('/userManagement/postSignup', postData, { withCredentials: true })
        return data
    } catch (error) {
        console.log(error);

    }
}



export const logout = async () => {
    localStorage.removeItem("section")
    return Cookies.remove('userToken')
}

export const forgetPasswordOtpSend = async (Email: string) => {
    const { data } = await axiosApiGateWay.get('/userManagement/forgetPasswordOtpSend?Email=' + Email, {
        headers: { "Authorization": "no token required" }
    })
    return data
}

export const forgetPasswordPost = async (userData: object) => {
    const { data } = await axiosApiGateWay.patch('/userManagement/changePassword', userData)
    return data
}


export const isUserAuthenticated = async () => {
    const token = getTokenCookie()
    if (token.split(' ')[1] !== "undefined") {
        const { data } = await axiosApiGateWay.get('/userManagement/isUserAuth')
        return data.status
    } else {
        return false
    }
}


export const changeChannelName = async (channelName: string) => {
    const { data } = await axiosApiGateWay.patch('/userManagement/changeChannelName?channelName=' + channelName)
    return data
}


export const changeProfileData = async (Data: object) => {
    const { data } = await axiosApiGateWay.patch('/userManagement/changeProfileData', Data)
    return data
}

export const changeProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const { data } = await axios.patch(`${process.env.REACT_APP_API_GATEWAY}/userManagement/changeProfileImage`, formData,
            {
                headers: {
                    Authorization: getTokenCookie(),
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};


export const getWalletDetails = async (userId: string) => {
    const { data } = await axiosApiGateWay.get('/userManagement/getWalletDetails?userId=' + userId)
    return data
}

export const addMoneyToWallet = async (details: Object) => {
    const { data } = await axiosApiGateWay.post('/userManagement/addMoneyToWallet', details)
    return data
}

export const withDrawMoneyToWallet = async (Data: Object) => {
    const { data } = await axiosApiGateWay.post('/userManagement/withDrawMoneyToWallet', Data)
    return data
}

export const subscribeToPremium = async (Data: SubscriptionInterfaceDataSuccess) => {
    const { data } = await axiosApiGateWay.patch('/userManagement/subscribeToPremium', Data)
    return data
}

export const isPremiumUser = async (userId: string) => {
    const { data } = await axiosApiGateWay.get('/userManagement/isPremiumUser?userId=' + userId)
    return data
}

export const isFollowing = async (userId: string, channelUserId: string) => {
    if (!userId) { return { status: false } }
    const { data } = await axiosApiGateWay.get('/userManagement/isFollowing?userId=' + userId + '&channelUserId=' + channelUserId)
    return data.data
}


export const followChannel = async (channelId: string) => {
    const { data } = await axiosApiGateWay.get('/userManagement/followChannel?channelId=' + channelId)
    return data
}

export const getChannelById = async (userId: string) => {
    const { data } = await axiosApiGateWay.get('/userManagement/getChannelById?channelId=' + userId)
    return data.data
}

export const getChannelByUserId = async (channelId: string) => {
    const { data } = await axiosApiGateWay.get('/userManagement/getChannelByUserId?channelId=' + channelId)
    console.log(data);

    return data
}

export const getfollowersByUserId = async (userId: string) => {
    const { data } = await axiosApiGateWay.get('/userManagement/getfollowersByUserId?userId=' + userId)
    return data.data
}

export const getPopularChannels = async (limit: number) => {
    const { data } = await axiosApiGateWay.get('/userManagement/getPopularChannels?limit=' + limit)
    return data
}

export const getTrendingChannels = async (limit: number) => {
    const { data } = await axiosApiGateWay.get('/userManagement/getTrendingChannels?limit=' + limit)
    return data
}


export const getNewChats = async (notIn: any) => {
    const { data } = await axiosApiGateWay.post('/userManagement/getNewChats', notIn)
    return data
}

export const getUserById = async (userId: string) => {
    const { data } = await axiosApiGateWay.get('/userManagement/getUserById?userId=' + userId)
    return data
}