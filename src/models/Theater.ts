import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Theater', theaterSchema, 'theaters');
