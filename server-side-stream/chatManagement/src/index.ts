import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import router from './presentation/routes/routes';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { connectSocket } from './data/socket/socketCode';
import '../config/database';
import cors from 'cors';
import http from 'http';

config();

const app = express();
export const server = http.createServer(app);

app.use(cors({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Authorization', 'Content-Type'],
    optionsSuccessStatus: 200
}));

const io = new Server(server, {  
    cors: {
        origin: process.env.CLIENT_SIDE_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

connectSocket(io); 

const port = process.env.PORT || "3000";

app.use(morgan('dev'));
app.use(express.json());

app.use('/', router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ status: false, message: 'no Route found!' });
});

server.listen(port, () => console.log(`Server is running at http://localhost:${port}`));

export default app;
