import { Server } from "socket.io";
import fs from 'fs';
import path from "path"
import { streamRepositaryLayer } from "../Repositary/stream_Repositary";


let screen: any = null
let camera: any = null

export function connectToSocket(io: Server) {

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('joinRoom', (uuid) => {
            socket.join(uuid)
        })

        socket.on("startLive", (liveDetails) => {


            const pathToScreen = path.join(__dirname, '../../public/streams', liveDetails.Uuid + "_screen" + ".webm")
            const pathToCamera = path.join(__dirname, '../../public/streams', liveDetails.Uuid + "_camera" + ".webm")
            screen = fs.createWriteStream(pathToScreen);
            camera = fs.createWriteStream(pathToCamera);

            // streamRepositaryLayer.insertLiveStreamData(liveDetails)

        })

        socket.on('stream', (data) => {
            io.to(data.uuid).emit('stream', data);
        });

        socket.on('saveCamera', (data) => {
            console.log(data);
            if (camera)
                camera.write(data)
        })

        socket.on('saveScreen', (data) => {
            console.log(data, "screen");
            if (screen)
                screen.write(data)
        })

        socket.on('stopLive', () => {
            if (screen) { screen.end() }
            if (camera) { camera.end() }
            console.log("successfully ended the stream");

        })

        socket.on('disconnect', () => {

            if (screen) { screen.end() }
            if (camera) { camera.end() }
            console.log('Client disconnected');
        });


    });
}

