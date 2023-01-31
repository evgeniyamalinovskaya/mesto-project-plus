import {
  model,
  Schema,
  Model,
  Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../errors/unauthorized-error';
import { regExp } from '../constants/index';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

// Поля схемы пользователя:
const UserSchema = new Schema<IUser>({
  name: {
    // имя пользователя (с обязательными полями)
    type: String,
    minlength: 2,
    maxlength: 30,
    dafault: 'Жак-Ив Кусто',
  },
  about: {
    // информация о пользователе
    type: String,
    minlength: 2,
    maxlength: 200,
    dafault: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => regExp.test(v),
      message: 'Некорректная ссылка',
    },
    dafault: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<any, any, IUser>>
}

UserSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
// попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user: { password: string }) => {
      // здесь в объекте user будет хеш пароля
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          // отклоняем промис
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
});

// TS-интерфейс модели User
export default model<IUser, UserModel>('User', UserSchema);
