"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToSocket = void 0;
const stream_Repositary_1 = require("../Repositary/stream_Repositary");
function connectToSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('joinRoom', (uuid) => {
            socket.join(uuid);
        });
        socket.on("startLive", (liveDetails) => {
            console.log(liveDetails);
        });
        socket.on('stream', (data) => {
            io.to(data.uuid).emit('stream', data);
        });
        socket.on("startLive", (liveDetails) => {
            console.log(liveDetails);
            stream_Repositary_1.streamRepositaryLayer.insertLiveStreamData(liveDetails);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}
exports.connectToSocket = connectToSocket;
