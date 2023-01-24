import { Request, Response } from 'express';
import Card from '../models/cards';
import { RequestCustom } from '../middleware/types';
import { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } from '../constants/index';

// возвращает все карточки
export const getCards = (req: Request, res: Response) => {
  // Из Get-запроса
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка'));
};

// создаёт карточку
export const createCard = (req: Request, res: Response) => {
  // вытащили нужные поля из POST-запроса
  const { name, link } = req.body;
  const id = (req as RequestCustom).user!._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send('Переданы некорректные данные при создании карточки');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};

// удаляет карточку по идентификатору _id
export const deleteCardById = (req: Request, res: Response) => {
  // вытащили нужные поля из DELETE-запроса
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send('Карточка с указанным _id не найдена');
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send('Переданы некорректные данные при удалении карточки');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};

// поставить лайк карточке
export const likeCard = (req: Request, res: Response) => {
  const id = (req as RequestCustom).user!._id;
  // вытащили нужные поля из PUT-запроса
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send('Карточка с указанным _id не найдена');
      }
      return res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send('Переданы некорректные данные для проставления лайка');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};

// убрать лайк с карточки
export const dislikeCard = (req: Request, res: Response) => {
  const id = (req as RequestCustom).user!._id;
  // вытащили нужные поля из DELETE-запроса
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send('Карточка с указанным _id не найдена');
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send('Переданы некорректные данные для удаления лайка');
      }
      return res.status(INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
    });
};
