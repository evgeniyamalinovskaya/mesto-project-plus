import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import * as dotenv from 'dotenv';
import routes from './routes/index';
import {
  createUser,
  login,
} from './controllers/users';
import auth from './middleware/auth';
import { errorLogger, requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errors';
import { validateLogin, validateUserBody } from './validator/validators';
// Для подключения
dotenv.config();

// Слушаем 3000 порт
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

// для ограничения количества запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // (здесь за 15 минут)
  max: 100, // Ограничение каждого IP до 100 запросов на «окно»
});

// подключаем логер запросов
app.use(requestLogger);

// Заголовки безопасности Content-Security-Policy
app.use(helmet());

// для собирания JSON-формата
app.use(json());

// Применяем ограничения скорости ко всем запросам
app.use(limiter);

// все обработчики роутов
app.post('/signin', validateLogin, login);
app.post('/signup', validateUserBody, createUser);

// авторизация
app.use(auth);

app.use(routes);

// подключаем логер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки
app.use(errorHandler);

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
