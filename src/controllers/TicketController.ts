import { Response } from 'express';
import { CustomRequest } from '../types/Request';
import { transactionSchema } from '../utils/zodSchema';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import TransactionSeat from '../models/TransactionSeat';

export const transactionTicket = async (req: CustomRequest, res: Response) => {
  try {
    const parse = transactionSchema.parse(req.body);

    const wallet = await Wallet.findOne({
      user: req.user?.id,
    });

    if (!wallet || (wallet && wallet.balance < parse.total)) {
      return res.status(400).json({
        data: null,
        message: 'Insufficient balance, please top up your balance first',
        status: 'Failed',
      });
    }

    const transaction = new Transaction({
      subtotal: parse.subtotal,
      total: parse.total,
      bookingFee: parse.bookingFee,
      tax: parse.tax,
      user: req.user?.id,
      movie: parse.movieId,
      theater: parse.theaterId,
      date: parse.date,
    });

    for (const seat of parse.seats) {
      const newSeat = new TransactionSeat({
        transaction: transaction.id,
        seat: seat,
      });

      await newSeat.save();
    }

    const transactionsSeats = await TransactionSeat.find({
      transaction: transaction.id,
    });

    transaction.seats = transactionsSeats.map((va) => va._id);

    const currBalance = wallet?.balance ?? 0;

    await Wallet.findByIdAndUpdate(wallet?.id, {
      balance: currBalance - parse.total,
    });

    await transaction.save();

    return res.status(200).json({
      message: 'Success transaction ticket',
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to transaction ticket',
      data: null,
      status: 'Failed',
    });
  }
};

export const getOrders = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user?.id;

    const transactions = await Transaction.find({
      user,
    })
      .select('seats movie theater date status')
      .populate({
        path: 'movie',
        select: 'thumbnail title genre -_id',
        populate: {
          path: 'genre',
          select: 'name -_id',
        },
      })
      .populate({
        path: 'seats',
        select: 'seat -_id',
      })
      .populate({
        path: 'theater',
        select: 'name city -_id',
      });

    return res.status(200).json({
      data: transactions,
      message: 'Success get data',
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

export const getOrderDetail = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .select('seats movie theater date status')
      .populate({
        path: 'movie',
        select: 'thumbnail title genre -_id',
        populate: {
          path: 'genre',
          select: 'name -_id',
        },
      })
      .populate({
        path: 'seats',
        select: 'seat -_id',
      })
      .populate({
        path: 'theater',
        select: 'name city -_id',
      });

    return res.status(200).json({
      data: transaction,
      message: 'Success get data',
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
