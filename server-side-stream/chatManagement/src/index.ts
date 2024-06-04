import express from 'express';
import { config } from 'dotenv'; config()
import router from './presentation/routes/routes';
import morgan from 'morgan';
import '../config/database';
import cors from 'cors';

const app = express(); 
const port = process.env.PORT || "";

 
app.use(morgan('dev')) 
app.use(express.json())

app.use(cors({
    origin: process.env.APIGATEWAY_URL,
    allowedHeaders: ['Authorization']
}))



app.use('/', router);




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
