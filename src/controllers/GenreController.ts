import type { Request, Response } from 'express';
import Genre from '../models/Genre';
import { genreSchema } from '../utils/zodSchema';

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find();

    return res.status(200).json({
      data: genres,
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

export const getGenreDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const genre = await Genre.findById(id);

    return res.status(200).json({
      data: genre,
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

export const postGenre = async (req: Request, res: Response) => {
  try {
    const body = genreSchema.parse(req.body);

    const genre = new Genre({
      name: body.name,
    });

    const newData = await genre.save();

    return res.status(201).json({
      message: 'Success create data',
      data: newData,
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

export const putGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const body = genreSchema.parse(req.body);

    await Genre.findByIdAndUpdate(id, {
      name: body.name,
    });

    const updatedData = await Genre.findById(id);

    return res.status(201).json({
      message: 'Success update data',
      data: updatedData,
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

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedData = await Genre.findById(id);

    await Genre.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Success delete data',
      data: deletedData,
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to delete data',
      data: null,
      status: 'Failed',
    });
  }
};
