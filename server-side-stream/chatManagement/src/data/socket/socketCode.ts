import { Server, Socket } from 'socket.io';
import { IChat } from '../interfaces/chatSchema';
import { chatRepoLayer } from '../repositaryLayer/chat_repositary';

export const connectSocket = (io: any) => {

    io.on('connection', (socket: Socket) => {
        console.log("scoket connected");

        socket.on('join', (Data) => { socket.join(Data); });

        socket.on('new_message', (Data) => {
            io.to(Data.to).emit('incoming_message', Data)
            chatRepoLayer.addChat(Data)
        })

    });

}
 