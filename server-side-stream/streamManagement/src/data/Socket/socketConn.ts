import { Server } from "socket.io";
import fs from 'fs';
import path from "path"
import { streamRepositaryLayer } from "../Repositary/stream_Repositary";


export function connectToSocket(io: Server) {

    io.on('connection', (socket) => {
        console.log('New client connected');


        socket.on('joinRoom', (uuid) => {
            socket.join(uuid)
        })


        socket.on("startLive", (liveDetails) => {
            console.log(liveDetails);

        })

        socket.on('stream', (data) => {
            io.to(data.uuid).emit('stream', data);
        });

        socket.on("startLive", (liveDetails) => {
            console.log(liveDetails);
            
            streamRepositaryLayer.insertLiveStreamData(liveDetails)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });


    });
}

