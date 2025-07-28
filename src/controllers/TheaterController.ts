import type { Request, Response } from 'express';
import Theater from '../models/Theater';
import { theaterSchema } from '../utils/zodSchema';

export const getTheaters = async (req: Request, res: Response) => {
  try {
    const theaters = await Theater.find();

    return res.status(200).json({
      message: 'Success get data',
      data: theaters,
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed get data',
      data: null,
      status: 'Failed',
    });
  }
};

export const getTheaterDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const theater = await Theater.findById(id);

    return res.status(200).json({
      message: 'Success get data',
      data: theater,
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed get data',
      data: null,
      status: 'Failed',
    });
  }
};

export const postTheater = async (req: Request, res: Response) => {
  try {
    const body = theaterSchema.parse(req.body);

    const theater = new Theater({
      name: body.name,
      city: body.city,
    });

    const newData = await theater.save();

    return res.status(201).json({
      message: 'Success create theater',
      data: newData,
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed create theater',
      data: null,
      status: 'Failed',
    });
  }
};

export const putTheater = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const body = theaterSchema.parse(req.body);

    await Theater.findByIdAndUpdate(id, {
      name: body.name,
      city: body.city,
    });

    const updatedData = await Theater.findById(id);

    return res.status(201).json({
      message: 'Success edit data',
      data: updatedData,
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed create theater',
      data: null,
      status: 'Failed',
    });
  }
};

export const deleteTheater = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedData = await Theater.findById(id);

    await Theater.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Success delete data',
      data: deletedData,
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed create theater',
      data: null,
      status: 'Failed',
    });
  }
};
