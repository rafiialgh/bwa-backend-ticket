import jwt from 'jsonwebtoken';
import type { NextFunction, Response } from 'express';
import type { CustomRequest } from '../types/Request';
import User from '../models/User';

type JWTPayload = {
  data: { id: string };
};

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const secretKey = process.env.SECRET_KEY ?? '';

  if (req.headers?.authorization?.split(' ')[0] === 'JWT') {
    const token = req.headers?.authorization?.split(' ')[1];

    try {
      const decode = (jwt.verify(token, secretKey)) as JWTPayload;

      const user = await User.findById(decode.data.id);

      if (!user) {
        return res.status(401).json({
          message: 'Token invalid',
        });
      }

      req.user = {
        id: user.id,
        name: user.name ?? '',
        email: user.email ?? '',
        role: user.role ?? '',
      };

      return next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Please login again!',
          status: 'Failed'
        })
      }

      return res.status(401).json({
        message: 'Invalid token',
        status: 'Failed'
      })
    }
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

export const verifyRole =
  (type: 'admin' | 'customer') =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req?.user?.role === type) {
      next();

      return;
    }

    return res.status(401).json({
      message: 'Unauthorized',
    });
  };
