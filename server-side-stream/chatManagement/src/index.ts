import express from 'express';
import { config } from 'dotenv'; config()
import router from './presentation/routes/routes';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { connectSocket } from './data/socket/socketCode'
import '../config/database';
import cors from 'cors';
import http from 'http';

const app = express();

export const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_SIDE_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
})

connectSocket(io)

const port = process.env.PORT || "";


app.use(morgan('dev'))
app.use(express.json())

app.use(cors({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true,
    allowedHeaders: ['Authorization']
}))



app.use('/', router);








server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
