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
import { Server } from "socket.io"

const app = express.default();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(cors({
  origin: "http://localhost:3000",
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
    console.log(data);
    wss.emit("message", data)
    // wss.clients.forEach((client) => {
    //     if (client.readyState === WebSocket.OPEN) {
    //         client.send(data);
    //     }
    // });
  });

  // ws.on('close', () => {
  //     console.log('Client disconnected');
  // });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

});


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('stream', (data) => {
    console.log(data);

    socket.broadcast.emit('stream', data);
  });

  socket.on('disconnect', () => {
    // console.log('Client disconnected');
  });


});


app.use('/', router);

server.listen(3001, () => {
  console.log('server started on port 3001');
});
