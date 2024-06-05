import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { responseObject } from '../../domain/interfaces/video_post_interface/videoPostInterface';

const PROTO_PATH = path.resolve(__dirname,"../protos/user_stream.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const grpcObject: any = grpc.loadPackageDefinition(packageDefinition);
const { UserStream } = grpcObject;
const PORT = process.env.GRPC_PORT || "undefined"

const client = new UserStream(PORT, grpc.credentials.createInsecure());

 const GetChannelNameFunction = (userId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const argument = userId;
        client.GetChannelName({ argument }, function (err: any, response: any) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            } else {
                resolve(response.userId);
            } 
        });
    });
};

 

export const getUserByIdGRPC = (userId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const argument = userId;
        client.getUserByIdGRPC({ argument }, function (err: any, response: any) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            } else {
                console.log(response);

                resolve(response);
            }
        });
    });
}

export const getProfileLink = (userId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const request = { userId: userId };
        client.getProfileLink(request, function (err: any, response: any) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            } else {
                resolve(response.profileLink);
            }
        });
    });
}

export const uploadVideoGRPC = (Data: any): Promise<responseObject> => {
    return new Promise((resolve, reject) => {
        const request = Data;
        client.uploadVideoGRPC(request, function (err: any, response: any) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            } else {
                resolve(response);
            }
        });
    })
}


export const searchProfileGRPC = (search: string): Promise<responseObject> => {
    return new Promise((resolve, reject) => {
        client.searchProfileGRPC({ search }, function (err: any, response: any) {
            if (err) {
                console.error('Error:', err);
                reject(err);
            } else {
                resolve(response);
            }
        });
    })
}
