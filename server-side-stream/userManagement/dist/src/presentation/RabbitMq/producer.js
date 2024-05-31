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
// src/producer.ts
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const ChangeUserDetails_Repositary_1 = require("../../data/Repositary/ChangeUserDetails_Repositary");
const queue = 'userId';
const AMQP = (_a = process.env.AMQP) !== null && _a !== void 0 ? _a : "";
callback_api_1.default.connect(AMQP, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        channel.assertQueue(queue, { durable: false });
        channel.consume(queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
            if (msg) {
                const userId = msg.content.toString();
                try {
                    const userDetails = yield ChangeUserDetails_Repositary_1.changeUserRepositaryLayer.getChannelNameByUserId(userId);
                    channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(userDetails)), {
                        correlationId: msg.properties.correlationId
                    });
                }
                catch (error) {
                    console.error("Error fetching user details:", error);
                    channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({ error: 'Error fetching user details' })), {
                        correlationId: msg.properties.correlationId
                    });
                }
                channel.ack(msg);
            }
        }));
    });
});
