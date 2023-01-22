import { model, Schema, Types } from 'mongoose';

export const regExp = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    // имя карточки:
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String, // Ссылка на картинку
    required: true,
    validate: {
      validator: (v: string) => regExp.test(v),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TS-интерфейс модели Card
export default model<ICard>('Card', cardSchema);
