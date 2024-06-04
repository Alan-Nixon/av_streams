// src/consumer.ts
import amqp from 'amqplib/callback_api';

const queue = 'userId';
const dataQueue = 'data';

const channelDetails = "channelDetails"
const searchChannel = "searchChannel"

const AMQP = process.env.AMQP ?? "";


export function getUserByIdRabbit(userId: string) {
    return new Promise(async (resolve, reject) => {

        const { connection, channel } = await connectRabbitMQ()

        const correlationId = implementQueue(channel, dataQueue);
        sendToQueue(channel, queue, userId, correlationId,dataQueue)


        channel.consume(dataQueue, (msg: { properties: { correlationId: string; }; content: { toString: () => string; }; }) => {

            if (msg?.properties.correlationId === correlationId) {
                const userDetails = JSON.parse(msg.content.toString())
                channel.ack(msg);
                connection.close();
                resolve(userDetails);
            }

        }, { noAck: false });

        channel.consume(dataQueue)

    });
}

export function searchProfileByUser(search: string) {
    return new Promise(async (resolve, reject) => {

        const { connection, channel } = await connectRabbitMQ()

        const correlationId = implementQueue(channel, channelDetails);
        sendToQueue(channel, searchChannel, search, correlationId,channelDetails)


        channel.consume(channelDetails, (msg: { properties: { correlationId: string; }; content: { toString: () => string; }; }) => {

            if (msg?.properties.correlationId === correlationId) {
                const userDetails = JSON.parse(msg.content.toString())
                channel.ack(msg);
                connection.close();
                resolve(userDetails);
            }

        }, { noAck: false });

        channel.consume(channelDetails)

    });
}
 

function connectRabbitMQ() {
    return new Promise<any>((resolve, reject) => {
        amqp.connect(AMQP, (error0, connection) => {
            if (error0) { throw error0 }
            connection.createChannel((error1, channel) => {
                if (error1) { throw error1 }
                resolve({ connection, channel })
            })
        })
    })
}


function implementQueue(channel: { assertQueue: (arg0: any, arg1: { durable: boolean; }) => void; }, dataQueue: string) {
    channel.assertQueue(dataQueue, { durable: false });
    return Math.random().toString() + Math.random().toString() + Math.random().toString()
}

function sendToQueue(channel: any, queue: string, data: string, correlationId: string,replyTo:string) {
    channel.sendToQueue(queue, Buffer.from(data), {
        correlationId: correlationId,
        replyTo
    });
} 