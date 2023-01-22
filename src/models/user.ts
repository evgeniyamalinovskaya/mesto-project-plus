import { model, Schema } from 'mongoose';

export const regExp = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

// Поля схемы пользователя:
const UserSchema = new Schema<IUser>({
  name: {
    // имя пользователя (с обязательными полями)
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    // информация о пользователе
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => regExp.test(v),
      message: 'Некорректная ссылка',
    },
  },
});

// TS-интерфейс модели User
export default model<IUser>('User', UserSchema);
