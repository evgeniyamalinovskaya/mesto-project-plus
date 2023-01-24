import { Router } from 'express';
import {
  createUser,
  editAvatar,
  editProfile,
  getAllUsers,
  getUserById,
} from '../controllers/users';

const useRouter = Router();

// возвращает всех пользователей
useRouter.get('/', getAllUsers);
// возвращает пользователя по _id
useRouter.get('/:userId', getUserById);
// создаём пользователя
useRouter.post('/', createUser);
// обновляет профиль
useRouter.patch('/me', editProfile);
// обновляет аватар
useRouter.patch('/me/avatar', editAvatar);

export default useRouter;
