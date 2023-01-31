import { Router } from 'express';
import {
  editAvatar,
  editProfile,
  getAllUsers,
  getUser,
  getUserById,
} from '../controllers/users';
import { validateAvatar, validateEditProfile, validateUserById } from '../validator/validators';

const useRouter = Router();

// информация о текущем пользователе
useRouter.get('/me', getUser);
// возвращает всех пользователей
useRouter.get('/', getAllUsers);
// возвращает пользователя по _id
useRouter.get('/:userId', validateUserById, getUserById);
// обновляет профиль
useRouter.patch('/me', validateEditProfile, editProfile);
// обновляет аватар
useRouter.patch('/me/avatar', validateAvatar, editAvatar);

export default useRouter;
