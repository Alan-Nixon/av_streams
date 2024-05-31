import * as WebSocket from 'ws';
import * as express from 'express';
import session from 'express-session';
import * as http from 'http';
import { config } from 'dotenv'; config();
import cors from 'cors';
import morgan from 'morgan';
import router from './presentation/Route/streamRoutes';
import '../config/Database'
import './presentation/Grpc/stream_user'
import './presentation/Rabbitmq/consumer'

const app = express.default();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(cors({
    origin: process.env.APIGATEWAY_URL,
    credentials: true,
    allowedHeaders: ["Session", "Cookie"]
}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.json());
app.use(morgan('dev'));




wss.on('connection', (ws) => {
    console.log("WebSocket connected");

    
    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});





app.use('/', router);

server.listen(3001, () => {
    console.log('server started on port 3001');
});
