import { Request, Response } from 'express';
import Movie from '../models/Movie';
import { movieSchema } from '../utils/zodSchema';
import path from 'node:path';
import fs from 'node:fs';
import Genre from '../models/Genre';
import Theater from '../models/Theater';

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find()
      .populate({
        path: 'genre',
        select: 'name',
      })
      .populate({
        path: 'theaters',
        select: 'name',
      });

    return res.status(200).json({
      data: movies,
      message: 'Success get data',
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to get data',
      data: null,
      status: 'Failed',
    });
  }
};

export const getMovieDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const movie = await Movie.findById(id)
      .populate({
        path: 'genre',
        select: 'name',
      })
      .populate({
        path: 'theaters',
        select: 'name',
      });

    return res.status(200).json({
      data: movie,
      message: 'Success get data',
      status: 'Success',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to get data',
      data: null,
      status: 'Failed',
    });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Thumbnail is required',
        data: null,
        status: 'Failed',
      });
    }

    const parse = movieSchema.safeParse({
      title: req.body.title,
      genre: req.body.genre,
      theaters: req.body.theaters.split(','),
      available: req.body.available === '1' ? true : false,
      description: req.body.description,
      price: Number.parseInt(req.body.price),
      bonus: req.body?.bonus,
    });

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => err.message);

      return res.status(400).json({
        message: 'Invalid request',
        details: errorMessage,
        status: 'Failed',
      });
    }

    const movie = new Movie({
      title: parse.data.title,
      genre: parse.data.genre,
      available: parse.data.available,
      theaters: parse.data.theaters,
      thumbnail: req.file?.filename,
      description: parse.data.description,
      price: parse.data.price,
      bonus: parse.data.bonus,
    });

    await movie.save();

    return res.status(201).json({
      data: movie,
      message: 'Success create data',
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to create data',
      data: null,
      status: 'Failed',
    });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parse = movieSchema.safeParse({
      title: req.body.title,
      genre: req.body.genre,
      theaters: req.body.theaters.split(','),
      available: req.body.available === '1' ? true : false,
      description: req.body.description,
      price: Number.parseInt(req.body.price),
      bonus: req.body?.bonus,
    });

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => err.message);

      return res.status(400).json({
        message: 'Invalid request',
        details: errorMessage,
        status: 'Failed',
      });
    }

    const oldMovie = await Movie.findById(id);

    if (!oldMovie) {
      return res.status(400).json({
        message: 'Movie data not found',
        data: null,
        status: 'Failed',
      });
    }

    if (req.file) {
      const dirname = path.resolve();
      const filepath = path.join(
        dirname,
        'public/uploads/thumbnails',
        oldMovie.thumbnail ?? ''
      );

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await Genre.findByIdAndUpdate(oldMovie.genre, {
      $pull: {
        movies: oldMovie._id,
      },
    });

    for (const theater of oldMovie.theaters) {
      await Theater.findByIdAndUpdate(theater._id, {
        $pull: {
          movies: oldMovie._id,
        },
      });
    }

    await Movie.findByIdAndUpdate(oldMovie._id, {
      title: parse.data.title,
      genre: parse.data.genre,
      available: parse.data.available,
      theaters: parse.data.theaters,
      thumbnail: req?.file ? req.file.filename : oldMovie.thumbnail,
      description: parse.data.description,
      price: parse.data.price,
      bonus: parse.data.bonus,
    });

    await Genre.findByIdAndUpdate(parse.data.genre, {
      $push: {
        movies: id,
      },
    });

    for (const theater of parse.data.theaters) {
      await Theater.findByIdAndUpdate(theater, {
        $push: {
          movies: id,
        },
      });
    }

    const updatedMovie = await Movie.findById(id);

    return res.status(200).json({
      message: 'Success update data',
      data: updatedMovie,
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to update data',
      data: null,
      status: 'Failed',
    });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(400).json({
        message: 'Data movie not found',
        status: 'failed',
        data: null,
      });
    }

    const dirname = path.resolve();
    const filepath = path.join(
      dirname,
      'public/uploads/thumbnails',
      movie.thumbnail ?? ''
    );

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await Genre.findByIdAndUpdate(movie.genre, {
      $pull: {
        movies: movie._id,
      },
    });

    for (const theater of movie.theaters) {
      await Theater.findByIdAndUpdate(theater._id, {
        $pull: {
          movies: theater._id,
        },
      });
    }

    await Movie.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Success delete data',
      data: movie,
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to update data',
      data: null,
      status: 'Failed',
    });
  }
};
