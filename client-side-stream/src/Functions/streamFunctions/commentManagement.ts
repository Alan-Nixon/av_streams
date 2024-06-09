import { axiosApiGateWay } from "../commonFunctions"
import { ReplyCommentInterface, propsComment } from "../interfaces"

export const getCommentByCate = async (cate: string) => {
    const { data } = await axiosApiGateWay.get('/commentManagement/get_all_comments_cate?cate=' + cate)
    return data?.data ? JSON.parse(data?.data as string) : []
}

export const uploadCommentFunc = async (Data: propsComment) => {
    const { data } = await axiosApiGateWay.post('/commentManagement/add_comment', Data)
    return data
}

export const uploadCommentReplyFunc = async (Reply: ReplyCommentInterface) => {
    const { data } = await axiosApiGateWay.post('/commentManagement/add_comment_reply', Reply)
    return data
}

export const commentLikeWithId = async (commentId: string, userId: string) => {
    const { data } = await axiosApiGateWay.patch('/commentManagement/like_comment', {
        commentId, userId
    })
    return data
}

export const getCommentsByLinkId = async (linkId: string, cate: string) => {
    const { data } = await axiosApiGateWay.get('/commentManagement/get_comment_by_linkid?cate=' + cate + '&linkId=' + linkId)
    return JSON.parse(data?.data as string) || []
}
