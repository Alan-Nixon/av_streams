import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';

import { changeUserRepositaryLayer } from '../../data/Repositary/ChangeUserDetails_Repositary';
import path from 'path';

 


const PROTO_PATH = path.resolve(__dirname,"../protos/user_stream.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const { UserStream }: any = grpc.loadPackageDefinition(packageDefinition);;
const server = new grpc.Server();
const PORT: string = process.env.GRPC_PORT_NUMBER || "0.0.0.0:50051"


server.addService(UserStream.service, {
    GetChannelName: getChannelNameHandler,
    getUserByIdGRPC: getUserById,
    getProfileLink: getProfileLink,
    uploadVideoGRPC: uploadVideoGRPC,
    searchProfileGRPC: searchProfileGRPC
});

server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) { console.error('Failed to bind server:', err); return; }
    console.log(`Grpc Server running on port ${port}`);
});



//functions

async function getChannelNameHandler(call: any, callback: any) {
    const argument = call.request.argument;
    const userId = await changeUserRepositaryLayer.getChannelNameByUserId(argument)
    callback(null, { userId });
}


async function getUserById(args: any, callback: any) {
    const userDetails = {
        _id: "fjrobr",
        userName: "some data",
        FullName: "some data",
        Phone: "some data",
        Email: "some data",
        Password: "some data",
        isAdmin: true,
        isBlocked: true,
        RefreshToken: "jhcjh",
    }
    callback(null, userDetails)
}

async function getProfileLink(call: any, callback: any) {
    const userId = call.request.userId
    const profileLink = await changeUserRepositaryLayer.getProfileLinkByUserId(userId)
    callback(null, { profileLink })
}


async function uploadVideoGRPC(call: any, callback: any) {
    await changeUserRepositaryLayer.uploadVideo(call.request)
    callback(null, { status: true, message: "success" })
}

async function searchProfileGRPC(call: any, callback: any) {
    const data = await changeUserRepositaryLayer.getProfilesBySearch(call.request.search)
    callback(null, { status: true, message: "success", data })
}  