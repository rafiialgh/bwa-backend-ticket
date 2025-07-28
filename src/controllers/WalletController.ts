import type { Request, Response } from 'express';
import type { CustomRequest } from '../types/Request';
import Wallet from '../models/Wallet';
import WalletTransaction from '../models/WalletTransaction';
import { topupSchema } from '../utils/zodSchema';

export const getBalance = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user?.id;

    const wallet = await Wallet.findOne({
      user,
    });

    console.log(wallet?._id);

    return res.status(200).json({
      data: {
        balance: wallet?.balance ?? 0,
      },
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

export const getTopUpHistory = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user?.id;

    const wallet = await Wallet.findOne({
      user,
    });

    const data = await WalletTransaction.find({
      wallet: wallet?._id,
    }).select('wallet price createAt status');

    return res.status(200).json({
      data,
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

export const topUpBalance = async (req: CustomRequest, res: Response) => {
  try {
    const parse = topupSchema.parse(req.body);

    const midtransUrl = process.env.MIDTRANS_TRANSACTION_URL ?? '';
    const midtransAuth = process.env.MIDTRANS_AUTH_STRING ?? '';

    const wallet = await Wallet.findOne({
      user: req.user?.id,
    });

    const topup = new WalletTransaction({
      wallet: wallet?.id,
      price: parse.balance,
      status: 'pending',
    });

    const midtransRequest = new Request(midtransUrl, {
      method: 'POST',
      body: JSON.stringify({
        transaction_details: {
          order_id: topup.id,
          gross_amount: parse.balance,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: req.user?.email,
        },
        callbacks: {
          finish: process.env.SUCCESS_PAYMENT_REDIRECT,
        },
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `BASIC ${midtransAuth}`,
      },
    });

    const midtransResponse = await fetch(midtransRequest);
    const midtransJson = await midtransResponse.json()

    await topup.save()

    return res.status(201).json({
      data: midtransJson,
      message: 'TopUp Success',
      status: 'Success'
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to topup balance',
      data: null,
      status: 'Failed',
    });
  }
};
