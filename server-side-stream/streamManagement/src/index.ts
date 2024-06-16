import * as express from 'express';
import session from 'express-session';
import * as http from 'http';
import { config } from 'dotenv'; config();
import { Server } from "socket.io"
import cors from 'cors';
import morgan from 'morgan';
import AWS from 'aws-sdk'


import router from './presentation/Route/streamRoutes';
import '../config/Database'
import './presentation/Grpc/stream_user'
import './presentation/Rabbitmq/consumer'
import { connectToSocket } from './data/Socket/socketConn';
import { generateToken04 } from './data/Adapters/createTokenLive';

const app = express.default();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_SIDE_URL,
    methods: ['GET', 'POST']
  }
})

app.use(cors({
  origin: process.env.CLIENT_SIDE_URL,
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


connectToSocket(io);


const appId = 817580044

const userId = "2520";
const secret = "e70f68377403aa358e08ecbe4cc01bd5"
const effectiveTimeInSecond = 100000
const payload = { userId: "2520" }

// console.log(generateToken04(appId,userId, secret, effectiveTimeInSecond,payload));


app.use('/', router);

server.listen(3001, () => {
  console.log('server started on port 3001');
});

