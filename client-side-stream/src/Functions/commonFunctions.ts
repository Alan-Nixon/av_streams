import axios, { AxiosProgressEvent } from "axios";
import Cookies from "js-cookie";
import { SetProgressFunction, commentInterface, postInterface } from "./interfaces";

export const getTokenCookie = () => {
    const token = Cookies.get('userToken')
    return "Bearer " + token
}


export const axiosApiGateWay = axios.create({
    baseURL: process.env.REACT_APP_API_GATEWAY, headers: {
        'Authorization': getTokenCookie()
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
    return array1;
}


export const getDate = (date: number, fullDay: string) => {
    let currentDate = (!fullDay) ? new Date() : new Date(fullDay);
    currentDate.setDate(currentDate.getDate() + date);

    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${currentDate.getFullYear()}-${month}-${day}`;
}

