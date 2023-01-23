import express, { json, Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import routes from './routes/index';
import { RequestCustom } from './middleware/types';

// Для подключения
dotenv.config();

// Слушаем 3000 порт
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(json());

// временное решение авторизации пользователя
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestCustom).user = {
    _id: '63c995bc49dfa82467a82afd',
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

async function connect() {
  try {
    mongoose.set('strictQuery', false);
    // подключаемся к серверу MongoiDB
    await mongoose.connect(MONGO_URL);
    console.log('База данных подключена');
    await app.listen(PORT);
    console.log('App listening on port', PORT);
  } catch (error) {
    console.log('Ошибка на стороне сервера', error);
  }
}

connect();
