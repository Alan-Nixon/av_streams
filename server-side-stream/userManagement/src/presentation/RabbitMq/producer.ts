// src/producer.ts
import amqp from 'amqplib/callback_api';
import { changeUserRepositaryLayer } from '../../data/Repositary/ChangeUserDetails_Repositary';

const queue = 'userId';
const AMQP = process.env.AMQP ?? "";

amqp.connect(AMQP, (error0, connection) => {

  if (error0) { throw error0; }

  connection.createChannel((error1, channel) => {
    
    if (error1) { throw error1; }

    channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (msg) => {
 
      if (msg) {

        const userId = msg.content.toString();

        try {
          const userDetails = await changeUserRepositaryLayer.getChannelNameByUserId(userId);

          channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(userDetails)), {
            correlationId: msg.properties.correlationId
          });

        } catch (error) {
          console.error("Error fetching user details:", error);
          channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({ error: 'Error fetching user details' })), {
            correlationId: msg.properties.correlationId
          });
        }

        channel.ack(msg);
      }

    });
  });
});
