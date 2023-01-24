import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const cardsRouter = Router();

// возвращает все карточки
cardsRouter.get('/', getCards);
// создаёт карточку
cardsRouter.post('/', createCard);
// удаляет карточку по идентификатору _id
cardsRouter.delete('/:cardId', deleteCardById);
// поставить лайк карточке
cardsRouter.put('/:cardId/likes', likeCard);
// убрать лайк с карточки
cardsRouter.delete('/:cardId/likes', dislikeCard);

export default cardsRouter;
