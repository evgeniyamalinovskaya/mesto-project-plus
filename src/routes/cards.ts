import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import { validateCardBody, validateCardById } from '../validator/validators';

const cardsRouter = Router();

// возвращает все карточки
cardsRouter.get('/', getCards);
// создаёт карточку
cardsRouter.post('/', validateCardBody, createCard);
// удаляет карточку по идентификатору _id
cardsRouter.delete('/:cardId', validateCardById, deleteCardById);
// поставить лайк карточке
cardsRouter.put('/:cardId/likes', validateCardById, likeCard);
// убрать лайк с карточки
cardsRouter.delete('/:cardId/likes', validateCardById, dislikeCard);

export default cardsRouter;
