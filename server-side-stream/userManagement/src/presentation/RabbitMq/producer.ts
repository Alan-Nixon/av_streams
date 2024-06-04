// src/producer.ts
import amqp from 'amqplib/callback_api';
import { changeUserRepositaryLayer } from '../../data/Repositary/ChangeUserDetails_Repositary';

const queue = 'userId';
const searchChannel = "searchChannel"


const AMQP = process.env.AMQP ?? "";  
 
amqp.connect(AMQP, (error0, connection) => {
  try {
    if (error0) { throw error0; }
    console.log("Rabbit started successfully"); 
    
    connection.createChannel((error1, channel) => {

      if (error1) { throw error1; }

      channel.assertQueue(queue, { durable: false });
      // channel.assertQueue(channelDetails, { durable: false });


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

      channel.consume(searchChannel, async (msg) => {

        if (msg) {

          const search = msg.content.toString();
          console.log(search);
          
          try {
            const userDetails = await changeUserRepositaryLayer.getProfilesBySearch(search);

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

  } catch (err:any) {
    console.log(err?.message ?? "rabbit error");
    
  }
  
}); 
 