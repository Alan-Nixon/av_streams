"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToSocket = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let screen = null;
let camera = null;
function connectToSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('joinRoom', (uuid) => {
            socket.join(uuid);
        });
        socket.on("startLive", (liveDetails) => {
            const pathToScreen = path_1.default.join(__dirname, '../../public/streams', liveDetails.Uuid + "_screen" + ".webm");
            const pathToCamera = path_1.default.join(__dirname, '../../public/streams', liveDetails.Uuid + "_camera" + ".webm");
            screen = fs_1.default.createWriteStream(pathToScreen);
            camera = fs_1.default.createWriteStream(pathToCamera);
            // streamRepositaryLayer.insertLiveStreamData(liveDetails)
        });
        socket.on('stream', (data) => {
            io.to(data.uuid).emit('stream', data);
        });
        socket.on('saveCamera', (data) => {
            console.log(data);
            if (camera)
                camera.write(data);
        });
        socket.on('saveScreen', (data) => {
            console.log(data, "screen");
            if (screen)
                screen.write(data);
        });
        socket.on('stopLive', () => {
            if (screen) {
                screen.end();
            }
            if (camera) {
                camera.end();
            }
            console.log("successfully ended the stream");
        });
        socket.on('disconnect', () => {
            if (screen) {
                screen.end();
            }
            if (camera) {
                camera.end();
            }
            console.log('Client disconnected');
        });
    });
}
exports.connectToSocket = connectToSocket;
