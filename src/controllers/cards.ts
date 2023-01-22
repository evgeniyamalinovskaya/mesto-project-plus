import { NextFunction, Request, Response } from 'express';
import Card from '../models/cards';
import { RequestCustom } from '../middleware/types';
import DefaultError from '../errors/default-error';
import NotFoundError from '../errors/notFound-error';

// возвращает все карточки
export const getCards = (req: Request, res: Response, next: NextFunction) => {
  // Из Get-запроса
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

// создаёт карточку
export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  // вытащили нужные поля из POST-запроса
  const { name, link } = req.body;
  const id = req.user!._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DefaultError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// удаляет карточку по идентификатору _id
export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  // вытащили нужные поля из DELETE-запроса
  Card.findById(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

// поставить лайк карточке
export const likeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.user!._id;
  // вытащили нужные поля из PUT-запроса
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, { new: true })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DefaultError('Переданы некорректные данные для проставления лайка'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

// убрать лайк с карточки
export const dislikeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.user!._id;
  // вытащили нужные поля из DELETE-запроса
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, { new: true })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DefaultError('Переданы некорректные данные для удаления лайка'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};
