import { Request, Response, Router } from 'express';
import userRoutes from './users';
import cardsRouter from './cards';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/cards', cardsRouter);

routes.use((req: Request, res: Response) => res.status(404).send('Страница не найдена'));

export default routes;
