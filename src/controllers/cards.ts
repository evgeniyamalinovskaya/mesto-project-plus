import { Request, Response, NextFunction } from 'express';
import Card from '../models/cards';
import { RequestCustom } from '../middleware/types';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

// возвращает все карточки
export const getCards = (req: Request, res: Response, next: NextFunction) => {
  // Из Get-запроса
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

// создаёт карточку
export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  // вытащили нужные поля из POST-запроса
  const { name, link } = req.body;
  const id = req.user?._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

// удаляет карточку по идентификатору _id
export const deleteCardById = (req: RequestCustom, res: Response, next: NextFunction) => {
  // вытащили нужные поля из DELETE-запроса
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (card && card.owner.toString() !== req.user?._id.toString()) {
        card.delete();
        res.send('Карточка удалена');
      } next(new ForbiddenError('Недостаточно прав для удаления карточки'));
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
      }
      next(err);
    });
};

// поставить лайк карточке
export const likeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  // вытащили нужные поля из PUT-запроса
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для проставления лайка'));
      }
      next(err);
    });
};

// убрать лайк с карточки
export const dislikeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  // вытащили нужные поля из DELETE-запроса
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления лайка'));
      }
      next(err);
    });
};
