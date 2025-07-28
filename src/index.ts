import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/database';
import cors from 'cors'
import adminRoutes from './routes/adminRoutes';
import bodyParser from 'body-parser';
import authRoutes from './routes/AuthRoutes';
import customerRoutes from './routes/customerRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))

connectDB();

app.use('/api', authRoutes)
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
