import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import NotFoundError from '../errors/notFound-error';
import DefaultError from '../errors/default-error';

// Возвращает всех пользователей
export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  // Из Get-запроса
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(err));
};

// Возвращает пользователя по _id
export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  // Из Get-запроса
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

// Cоздаём пользователя
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  // вытащили нужные поля из POST-запроса
  const { name, about, avatar } = req.body;
  // передали их объектом в метод модели
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DefaultError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// обновляет профиль
export const editProfile = (req: any, res: Response, next: NextFunction) => {
  // вытащили нужные поля из PATCH-запроса
  const { name, about } = req.body;
  // передали их объектом в метод модели
  User.findByIdAndUpdate(req.user, { name, about })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DefaultError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

// обновляет аватар
export const editAvatar = (req: any, res: Response, next: NextFunction) => {
  // вытащили нужные поля из PATCH-запроса
  const { avatar } = req.body;
  // передали их объектом в метод модели
  User.findByIdAndUpdate(req.user, { avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DefaultError('Переданы некорректные данные для обновления аватара'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};
