import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { JWT_SECRET } from '../constants/index';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import { RequestCustom } from '../middleware/types';

// Возвращает всех пользователей
export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  // Из Get-запроса
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

// Возвращает пользователя по _id
export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  // Из Get-запроса
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

// Cоздаём пользователя
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  // вытащили нужные поля из POST-запроса
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name,
        about,
        avatar,
        email,
        password: hash,
      },
    ))
    .then((user) => res.status(201).send({ data: user }))
    // нужно добавить, что происходило удаление пароля в ответе postman пользователя?!!!!
    .catch((err) => {
      // пользователь пытается зарегистрироваться уже по существующему email
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

// обновляет профиль
export const editProfile = (req: RequestCustom, res: Response, next: NextFunction) => {
  // вытащили нужные поля из PATCH-запроса
  const { name, about } = req.body;
  const me = req.user?._id;
  // передали их объектом в метод модели
  User.findByIdAndUpdate(me, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

// обновляет аватар
export const editAvatar = (req: RequestCustom, res: Response, next: NextFunction) => {
  // вытащили нужные поля из PATCH-запроса
  const { avatar } = req.body;
  const me = req.user?._id;
  // передали их объектом в метод модели
  User.findByIdAndUpdate(me, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для обновления аватара'));
      }
      next(err);
    });
};

// логин
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

// возвращем информацию о текущем пользователе
export const getUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  const me = req.user?._id;
  User.findById(me)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден с таким id'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};
