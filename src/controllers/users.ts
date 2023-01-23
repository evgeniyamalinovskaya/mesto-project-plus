import { Request, Response } from 'express';
import User from '../models/user';
import { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } from '../constants/index';

// Возвращает всех пользователей
export const getAllUsers = (req: Request, res: Response) => {
  // Из Get-запроса
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch ((err) => {
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};

// Возвращает пользователя по _id
export const getUserById = (req: Request, res: Response) => {
  // Из Get-запроса
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(BAD_REQUEST_ERROR).send('Пользователь по указанному _id не найден');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};

// Cоздаём пользователя
export const createUser = (req: Request, res: Response) => {
  // вытащили нужные поля из POST-запроса
  const { name, about, avatar } = req.body;
  // передали их объектом в метод модели
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send('Переданы некорректные данные при создании пользователя');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};

// обновляет профиль
export const editProfile = (req: any, res: Response) => {
  // вытащили нужные поля из PATCH-запроса
  const { name, about } = req.body;
  // передали их объектом в метод модели
  User.findByIdAndUpdate(req.user, { name, about })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send('Переданы некорректные данные при обновлении профиля');
      } if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR).send('Пользователь по указанному _id не найден');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};

// обновляет аватар
export const editAvatar = (req: any, res: Response) => {
  // вытащили нужные поля из PATCH-запроса
  const { avatar } = req.body;
  // передали их объектом в метод модели
  User.findByIdAndUpdate(req.user, { avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send('Переданы некорректные данные для обновления аватара');
      }
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERROR).send('Пользователь по указанному _id не найден');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};
