"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const chat_repositary_1 = require("../repositaryLayer/chat_repositary");
const connectSocket = (io) => {
    io.on('connection', (socket) => {
        console.log("scoket connected");
        socket.on('join', (Data) => { socket.join(Data); });
        socket.on('new_message', (Data) => {
            io.to(Data.to).emit('incoming_message', Data);
            chat_repositary_1.chatRepoLayer.addChat(Data);
        });
    });
};
exports.connectSocket = connectSocket;
