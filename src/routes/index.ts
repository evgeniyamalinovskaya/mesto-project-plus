import { Router } from 'express';
import userRoutes from './users';
import cardsRouter from './cards';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/cards', cardsRouter);

export default routes;
