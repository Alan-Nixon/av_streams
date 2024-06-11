

export type liveDataInteface = {
    Title: string,
    Description: string,
    Thumbnail:Buffer | string
}

export type livestreamInterface = {
    insertLiveStreamData(data:liveDataInteface): Promise<void>;
}