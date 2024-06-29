import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { config } from 'dotenv'; config();

import { Server, Socket } from 'socket.io';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app: Application = express();

const clientSideUrl = process.env.CLIENT_SIDE_URL || 'http://localhost:3000';
const port = process.env.PORT || '8000';

if (!process.env.CHATMANAGEMENT || !process.env.USERMANAGEMENT || !process.env.STREAMMANAGEMENT || !process.env.COMMENTMANAGEMENT) {
    console.error('Some required environment variables are missing!');
    process.exit(1);
}

app.use(cors({
    origin: clientSideUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
}));

app.use(morgan('dev'));

export type ProxyConfig = {
    [key: string]: {
        target: string;
        changeOrigin: boolean;
        timeout: number;
        proxyTimeout: number;
        pathRewrite?: { [key: string]: string };
    };
};

const proxyConfig: ProxyConfig = {
    '/chatManagement': {
        target: process.env.CHATMANAGEMENT!,
        changeOrigin: true,
        pathRewrite: { '^/chatManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/userManagement': {
        target: process.env.USERMANAGEMENT!,
        changeOrigin: true,
        pathRewrite: { '^/userManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/streamManagement': {
        target: process.env.STREAMMANAGEMENT!,
        changeOrigin: true,
        pathRewrite: { '^/streamManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    },
    '/commentManagement': {
        target: process.env.COMMENTMANAGEMENT!,
        changeOrigin: true,
        pathRewrite: { '^/commentManagement': '' },
        timeout: 60000,
        proxyTimeout: 60000
    }
};

Object.keys(proxyConfig).forEach((path) => {
    app.use(path, createProxyMiddleware({
        target: proxyConfig[path].target,
        changeOrigin: proxyConfig[path].changeOrigin,
        pathRewrite: proxyConfig[path].pathRewrite,
        timeout: proxyConfig[path].timeout,
        proxyTimeout: proxyConfig[path].proxyTimeout
    }));
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: clientSideUrl,
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

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

app.use('*', (req, res) => res.status(404).json({ status: false, message: "Service not specified" }));

server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));

export default app;
