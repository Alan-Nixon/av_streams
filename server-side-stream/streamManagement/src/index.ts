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
import { generateToken04 } from './data/Adapters/server/zegoServerAssistant';


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


app.use('/', router);

server.listen(3001, () => {
  console.log('server started on port 3001');
});




 