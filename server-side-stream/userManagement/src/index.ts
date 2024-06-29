import express, { Application, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';config(); 
import '../config/Database'; 
import router from './presentation/Routes/Routes';
import AdminRouter from './presentation/Routes/AdminRoutes';
import morgan from 'morgan';
import cors from 'cors';
import '../src/presentation/Grpc/user_stream'; 
import './presentation/RabbitMq/producer'; 

const app: Application = express();
const port = process.env.PORT || 8000;
  

app.use(cors({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true,
    allowedHeaders: ['Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// Route handling
app.use('/', router); 
app.use('/', AdminRouter);

// 404 Handler 
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Server startup
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
