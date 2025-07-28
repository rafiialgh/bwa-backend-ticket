import mongoose from 'mongoose';
import { getAssetUrl } from '../utils/helper';
import Genre from './Genre';
import Theater from './Theater';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
    },
    theaters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
      },
    ],
    description: {
      type: String,
      require: true,
    },
    thumbnail: {
      type: String,
      require: true,
    },
    price: Number,
    available: Boolean,
    bonus: String,
  },
  {
    virtuals: {
      thumbnailUrl: {
        get() {
          return `${getAssetUrl()}${this.thumbnail}`;
        },
      },
    },
    toJSON: {
      virtuals: true,
    },
  }
);

movieSchema.post('save', async (doc) => {
  if (doc) {
    await Genre.findByIdAndUpdate(doc.genre, {
      $push: {
        movies: doc._id,
      },
    });

    for (const theater of doc.theaters) {
      await Theater.findByIdAndUpdate(theater._id, {
        $push: {
          movies: theater._id,
        },
      });
    }
  }
});

movieSchema.post('deleteOne', async (doc) => {
  if (doc) {
    await Genre.findByIdAndUpdate(doc.genre, {
      $pull: {
        movies: doc._id,
      },
    });

    for (const theater of doc.theaters) {
      await Theater.findByIdAndUpdate(theater._id, {
        $pull: {
          movies: theater._id,
        },
      });
    }
  }
})

export default mongoose.model('Movie', movieSchema, 'movies');
