import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import jwtRoute from './routes/jwtRoute';
import mySqlRoute from './routes/mySqlRoute';
import redisCtrl from './controllers/redisCtrl';
require('dotenv').config();

const app: Application = express();
const port = process.env.PORT || 3100;

app.use(express.json());
app.use(cors());

app.get("/",(req: Request, res: Response)=>{
  res.json({message:"halo"})
});

// Routes
app.use('/jwt', jwtRoute);
app.use('/mysql', mySqlRoute);
app.use('/redis', redisCtrl);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
