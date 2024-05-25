export interface emailJsonObject {
    Email: string
}

export interface loginData {
    userId: string | undefined
    _id?: string
    userName?: string
    FullName?: string
    isBlocked: boolean
    Email: string,
    Password: string
}

export interface UserData {
    Email: string,
    Password: string,
    isBlocked: boolean,
    isAdmin: boolean,
    userName: string,
    FullName: string,
    Phone: number
}

export interface payload {
    id: string,
    username: string,
    email: string,
    iat: number
}

export interface ImageData {
    size: number;
    filepath: string;
    newFilename: string;
    mimetype: string;
    mtime: string;
    originalFilename: string;
}

