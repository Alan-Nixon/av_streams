import axios, { AxiosProgressEvent } from "axios";
import Cookies from "js-cookie";
import { SetProgressFunction, commentInterface, postInterface } from "./interfaces";
import { getChannelByUserId } from "./userFunctions/userManagement";
import { toast } from "react-toastify";

export const getTokenCookie = () => {
    const token = Cookies.get('userToken')
    return "Bearer " + token
}



export const axiosApiGateWay = axios.create({
    baseURL: process.env.REACT_APP_API_GATEWAY, headers: {
        "Content-Type": "application/json",
        'Authorization': getTokenCookie(),
        "Access-Control-Allow-Origin": "*",
    }
})

axiosApiGateWay.interceptors.response.use(
    (response: any) => {
        if (response.status === 204) {
            Cookies.remove('userToken')
            window.location.href = '/login'
        } else {
            return response;
        }
    },
    (error) => {
        console.log(error, "this is the error");

        const { response } = error;
        if (response) {
            const { status, data } = response;
            if (status === 401) {
                Cookies.remove('userToken');
                window.location.href = '/login';
            } else if (status === 403) {
                if (data.status) {
                    Cookies.set("userToken", data.token, { expires: 7 });
                } else {
                    Cookies.remove('userToken');
                    window.location.href = '/login';
                }
            } else if (status === 504){
                console.log(":service ");
                return toast.error("service not available")
            }
        } else {
            // window.location.href = '/error';
            console.log(error);

        }
        return Promise.reject(error);
    }
);



export const getUser = async (token: string | undefined) => {
    if (token) {
        const { data } = await axiosApiGateWay('/userManagement/userDetails')
        if (!data.status) {
            window.location.href = '/'
            return
        }
        return data.userData
    }
}


export const calculateProgress = (progressEvent: AxiosProgressEvent, setProgress: SetProgressFunction) => {
    if (progressEvent.total !== undefined) {
        const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        if (percentage === 100) {
            setTimeout(() => {
                setProgress(-1)
            }, 3000);
        }
        setProgress(percentage);
    } else {
        console.warn('Unable to calculate upload progress: total size is undefined');
    }
}


export const numTokandM = (numString: string) => {
    const number = Number(numString)
    if (number > 999 && number < 1000000) {
        return removeExtraDecimals((number / 1000).toString()) + "k"
    } else if (number >= 1000000) {
        return removeExtraDecimals((number / 1000000).toString()) + "M"
    } else {
        return numString
    }
}


function removeExtraDecimals(inputString: string) {
    let decimalPosition = inputString.indexOf('.');
    if (decimalPosition === -1 || decimalPosition === inputString.length - 1 || Number(inputString) > 10) {
        return Math.floor(parseFloat(inputString)).toString();
    }
    return inputString.slice(0, decimalPosition + 2);
}



export const likePostHome = (postId: string) => {
    return axiosApiGateWay.patch('/streamManagement/likePost', { postId })
}


export const joinCommentWithpost = (array1: postInterface[], array2: commentInterface[], userId: string) => {
    if (array2) {
        for (const elem of array2) {
            if (elem.likedUsers.length && elem.likedUsers.includes(userId)) { elem.isUserLiked = true }
            const foundedPost = array1.find((item) => item._id === elem.LinkId);
            if (foundedPost) {
                if (foundedPost.Comments) {
                    foundedPost.Comments.push(elem);
                } else {
                    foundedPost.Comments = [elem]
                }
            }
        }
        for (const item of array1) {
            item.liked = item.likesArray?.includes(userId) ? true : false;
        }
    }

    return array1;
}


export const getDate = (date: number, fullDay: string) => {
    let currentDate = (!fullDay) ? new Date() : new Date(fullDay);
    currentDate.setDate(currentDate.getDate() + date);
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${currentDate.getFullYear()}-${month}-${day}`;
}

export const scrollDown = () => {
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }, 0);
}

export const getPersonDetailsChat = async (data: any, user: string) => {
    const personDetails = []
    for (let val of data) {
        val.personId = val.userId.filter((item: string) => item !== user)
        val.personDetails = await getChannelByUserId(val.personId[0])
        personDetails.push(val)
    }
    return personDetails
}

export function getTimeDifference(targetDate: string) {
    const currentDate = new Date();
    const targetDateTime = new Date(targetDate).getTime();
    const currentTime = currentDate.getTime();

    const timeDifference = Math.abs(targetDateTime - currentTime);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)) % 365);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let timeString = '';

    if (years > 0) { timeString += years + (years === 1 ? ' year ' : ' years '); }
    if (months > 0) { timeString += months + (months === 1 ? ' month ' : ' months '); }
    if (days > 0) { timeString += days + (days === 1 ? ' day ' : ' days '); }
    if (hours > 0) { timeString += hours + (hours === 1 ? ' hour ' : ' hours '); }
    if (minutes > 0) { timeString += minutes + (minutes === 1 ? ' minute ' : ' minutes '); }

    return timeString.trim();
}



