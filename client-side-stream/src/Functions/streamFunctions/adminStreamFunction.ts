import { adminAxiosApiGateWay } from "../userFunctions/adminManagement"


export const getReportsBySection = async (Section: string) => {
    const { data } = await adminAxiosApiGateWay.get('/streamManagement/getReportsBySection?Section=' + Section)
    return data
}

export const getBlockedVideos = async () => {
    const { data } = await adminAxiosApiGateWay.get('/streamManagement/getBlockedVideos',)
    return data
}

export const blockContentVisiblity = async (LinkId: string, Section: string, reportId: string) => {
    const { data } = await adminAxiosApiGateWay.patch('/streamManagement/blockContentVisiblity', { LinkId, Section, reportId })
    return data
}

export const ChangeVisiblityContent = async (LinkId: string, Section: string) => {
    const { data } = await adminAxiosApiGateWay.patch('/streamManagement/ChangeVisiblityContent', { LinkId, Section })
    return data
}

export const getCategory = async () => {
    const { data } = await adminAxiosApiGateWay.get('/streamManagement/getCategory')
    return data
}

export const blockCategoryCateId = async (cateId: string) => {
    const { data } = await adminAxiosApiGateWay.patch('/streamManagement/blockcategory', {cateId})
    return data
}

export const addCategory = async (cateDetails: { categoryName: string, Description: string }) => {
    const { data } = await adminAxiosApiGateWay.post('/streamManagement/addCategory', cateDetails)
    return data
}