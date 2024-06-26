import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { config } from 'dotenv'; config();

import { Server, Socket } from 'socket.io';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app: Application = express();




app.use(cors({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
}));


app.use(morgan('dev'));



export type ProxyConfig = {
    [key: string]: {
        target: string;
        changeOrigin: boolean;
        timeout: number,
        proxyTimeout: number, 
        pathRewrite?: { [key: string]: string };
    };
}



const proxyConfig: ProxyConfig = {
    '/chatManagement': {
        target: process.env.CHATMANAGEMENT || '',
        changeOrigin: true,
        pathRewrite: { '^/chatManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/userManagement': {
        target: process.env.USERMANAGEMENT || '',
        changeOrigin: true,
        pathRewrite: { '^/userManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/streamManagement': {
        target: process.env.STREAMANAGEMENT || '',
        changeOrigin: true,
        pathRewrite: { '^/userManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/commentManagement': {
        target: process.env.COMMENTMANAGEMENT || '',
        changeOrigin: true,
        pathRewrite: { '^/commentManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    }
};


Object.keys(proxyConfig).forEach(context => {
    app.use(context, createProxyMiddleware(proxyConfig[context]));
});


const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_SIDE_URL,
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        credentials: true
    }
});


io.on('connection', (socket: Socket) => {
    console.log("Socket connected");

    socket.on('join', (data) => {
        socket.join(data);
    });

    socket.on('followChannel', ({ data, userId }) => {
        io.to(userId).emit('showFollowMessage', data);
    });
});


app.use('*', (req, res) => res.status(200).json({ status: false, message: "service not specified" }))

const PORT: string = process.env.PORT || "8000";
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

export default app;
