import { Request, Response, Router } from 'express';
import userRoutes from './users';
import cardsRouter from './cards';
import { NOT_FOUND_ERROR } from '../constants/index';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/cards', cardsRouter);

routes.use((req: Request, res: Response) => res.status(NOT_FOUND_ERROR).send('Страница не найдена'));

export default routes;
