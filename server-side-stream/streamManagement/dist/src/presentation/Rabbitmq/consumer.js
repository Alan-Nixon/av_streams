"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProfileByUser = exports.getUserByIdRabbit = void 0;
// src/consumer.ts
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const queue = 'userId';
const dataQueue = 'data';
const channelDetails = "channelDetails";
const searchChannel = "searchChannel";
const AMQP = (_a = process.env.AMQP) !== null && _a !== void 0 ? _a : "";
function getUserByIdRabbit(userId) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const { connection, channel } = yield connectRabbitMQ();
        const correlationId = implementQueue(channel, dataQueue);
        implementQueue(channel, channelDetails);
        sendToQueue(channel, queue, userId, correlationId, dataQueue);
        channel.consume(dataQueue, (msg) => {
            if ((msg === null || msg === void 0 ? void 0 : msg.properties.correlationId) === correlationId) {
                const userDetails = JSON.parse(msg.content.toString());
                channel.ack(msg);
                connection.close();
                resolve(userDetails);
            }
        }, { noAck: false });
        channel.consume(dataQueue);
    }));
}
exports.getUserByIdRabbit = getUserByIdRabbit;
function searchProfileByUser(search) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { connection, channel } = yield connectRabbitMQ();
            const correlationId = implementQueue(channel, channelDetails);
            sendToQueue(channel, searchChannel, search, correlationId, channelDetails);
            channel.consume(channelDetails, (msg) => {
                if ((msg === null || msg === void 0 ? void 0 : msg.properties.correlationId) === correlationId) {
                    const userDetails = JSON.parse(msg.content.toString());
                    channel.ack(msg);
                    connection.close();
                    resolve(userDetails);
                }
            }, { noAck: false });
            channel.consume(channelDetails);
        }
        catch (error) {
            console.log(error);
            reject((_a = error.message) !== null && _a !== void 0 ? _a : "error occurred");
        }
    }));
}
exports.searchProfileByUser = searchProfileByUser;
function connectRabbitMQ() {
    return new Promise((resolve, reject) => {
        try {
            callback_api_1.default.connect(AMQP, (error0, connection) => {
                if (error0) {
                    throw error0;
                }
                connection.createChannel((error1, channel) => {
                    if (error1) {
                        throw error1;
                    }
                    resolve({ connection, channel });
                });
            });
        }
        catch (error) {
            reject("some error occured");
        }
    });
}
function implementQueue(channel, dataQueue) {
    channel.assertQueue(dataQueue, { durable: false });
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
function sendToQueue(channel, queue, data, correlationId, replyTo) {
    channel.sendToQueue(queue, Buffer.from(data), {
        correlationId: correlationId,
        replyTo
    });
}
