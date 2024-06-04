
export type responseInterface = {
    status: boolean,
    message: string,
    data?: any
}

export type chat_use_case_interface = {
    errorResponse(error: any): responseInterface;
    successResponse(data: any): responseInterface;
    getChatOfUser(userId: string): Promise<responseInterface>;
}