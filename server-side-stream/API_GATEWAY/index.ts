import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan'
import http from 'http';
import { config } from 'dotenv'; config()
import router from './Routes/userRoutes';
import streamRouter from './Routes/streamRoutes';
import commentRouter from './Routes/commentRoutes';

import { Server, Socket } from 'socket.io';


const app: Application = express();

console.log(process.env.CLIENT_SIDE_URL);

app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_SIDE_URL, 
    optionsSuccessStatus: 200
}))

app.use(morgan('dev'))

app.use('/userManagement', router)
app.use('/streamManagement', streamRouter) 
app.use('/commentManagement', commentRouter)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_SIDE_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
})


io.on('connection', (socket: Socket) => {
    console.log("scoket connected");
    
    socket.on('join', (Data) => { socket.join(Data); });

    socket.on('followChannel',({data,userId})=>{ 
        io.to(userId).emit('showFollowMessage',data)
    })

});



const PORT: string = process.env.PORT || "";
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
