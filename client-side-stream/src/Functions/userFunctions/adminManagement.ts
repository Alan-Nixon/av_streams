import axios from "axios"
import Cookies from "js-cookie"
import { createUser } from "../interfaces"

export const adminGetToken = () => {
    return "Bearer " + Cookies.get('adminToken')
}

export const adminAxiosApiGateWay = axios.create({
    baseURL: process.env.REACT_APP_API_GATEWAY, headers: {
        'Authorization': adminGetToken()
    }
})

adminAxiosApiGateWay.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error) => {
        console.log(error, "this is the error");

        const { response } = error;
        
        return response
    }
);

export const isAdminAuthenticated = async () => {
    const token = adminGetToken()
    if (token.split(' ')[1] !== 'undefined') {
        const { data } = await adminAxiosApiGateWay.get('/userManagement/isAdminAuth')
        return data ? data.status : false
    } else {
        return false
    }
}

export const adminPostLogin = async (Data: object) => {
    const { data } = await adminAxiosApiGateWay.post('/userManagement/adminPostLogin', Data)
    return data;
}

export const logoutAdmin = () => {
    Cookies.remove('adminToken')
    window.location.href = '/admin/adminLogin'
}


export const getAllUsers = async () => {
    try {
        const { data } = await adminAxiosApiGateWay.get('/userManagement/getAllUsers')
        return data.usersData
    } catch (error) {
        console.error(error);

    }
}

export const blockUserId = async (userId: string | undefined) => {
    const { data } = await adminAxiosApiGateWay.get('/userManagement/blockUser?userId=' + userId)
    return data
}

export const adminCreateUser = async (userData: createUser) => {
    const { data } = await adminAxiosApiGateWay.post('/userManagement/createUser', userData)
    return data.status
}

export const getBannerByLocation = async (location: string) => {
    const { data } = await adminAxiosApiGateWay.get('/userManagement/getBannerByLocation?location=' + location)
    return data
}

export const addBannerImageAdmin = async (file: Object) => {
    const { data } = await adminAxiosApiGateWay.post('/userManagement/addbanner', file, {
        headers: {
            Authorization: adminGetToken(),
            'Content-Type': 'multipart/form-data;',
        },
    })
    return data
}

export const updateBannerImage = async (file: File, bannerId: string) => {
    const { data } = await adminAxiosApiGateWay.post('/userManagement/updateBanner', { file, bannerId }, {
        headers: {
            Authorization: adminGetToken(),
            'Content-Type': 'multipart/form-data;',
        },
    })
    return data
}


export const getPremiumUsers = async () => {
    const { data } = await adminAxiosApiGateWay.get('/userManagement/getPremiumUsers')
    return data
}


export const cancelSubscription = async (subscription: Object) => {
    const { data } = await adminAxiosApiGateWay.patch('/userManagement/cancelSubscription', subscription)
    return data
}