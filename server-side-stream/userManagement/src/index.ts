import express, { Application } from 'express';
import { config } from 'dotenv'; config()
import '../config/Database'
import router from './presentation/Routes/Routes';
import AdminRouter from './presentation/Routes/AdminRoutes'
import morgan from 'morgan'
import cors from 'cors'
import '../src/presentation/Grpc/user_stream'


const app: Application = express();
const port = process.env.PORT || 8000; 

app.use(cors({
    origin: process.env.APIGATEWAY_URL,
    allowedHeaders: ['Authorization']
}))

app.use(express.json())
app.use(morgan('dev'))


app.use('/', router)
app.use('/', AdminRouter) 
 


  

app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});


export default app