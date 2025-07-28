import { Request, Response } from 'express';
import { authSchema } from '../utils/zodSchema';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Wallet from '../models/Wallet';

export const login = async (req: Request, res: Response) => {
  try {
    const parse = authSchema
      .omit({
        name: true,
      })
      .parse(req.body);

    const checkUser = await User.findOne({
      email: parse.email,
      role: parse.role,
    });

    if (!checkUser) {
      return res.status(400).json({
        data: null,
        message: 'Email not registered',
        status: 'Failed',
      });
    }

    const comparePassword = bcrypt.compareSync(
      parse.password,
      checkUser.password!
    );

    if (!comparePassword) {
      return res.status(400).json({
        data: null,
        message: 'Email or Password incorect',
        status: 'Failed',
      });
    }

    const secretKey = process.env.SECRET_KEY ?? '';

    const token = jwt.sign(
      {
        data: {
          id: checkUser.id,
        },
      },
      secretKey,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      data: {
        name: checkUser.name,
        email: checkUser.email,
        role: checkUser.role,
        photoUrl: checkUser.photoUrl,
        token,
      },
      message: 'Success login',
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: 'Failed to login',
      status: 'Failed',
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const parse = authSchema
      .omit({
        role: true,
      })
      .safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => err.message);

      return res.status(400).json({
        data: errorMessage,
        message: 'Invalid request',
        status: 'Failed',
      });
    }

    const emailExisted = await User.findOne({
      email: parse.data.email,
    });

    if (emailExisted) {
      return res.status(400).json({
        data: null,
        message: 'Email already exist',
        status: 'Failed',
      });
    }

    const hashPassword = bcrypt.hashSync(parse.data.password, 12);

    const user = new User({
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      role: 'customer',
      photo: req.file?.filename,
    });

    const wallet = new Wallet({
      balance: 0,
      user: user._id,
    });

    await user.save();
    await wallet.save();

    return res.status(200).json({
      data: {
        name: user.name,
        email: user.email,
      },
      message: 'Success to register',
      status: 'Success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: 'Failed to register',
      status: 'Failed',
    });
  }
};
