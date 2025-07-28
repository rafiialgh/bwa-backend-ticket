import express from 'express';
import globalRoutes from './GlobalRoutes';
import { verifyRole, verifyToken } from '../../middleware/verifyToken';
import walletRoutes from './WalletRoutes';

const customerRoutes = express.Router();

customerRoutes.use(verifyToken);
customerRoutes.use(verifyRole('customer'));
customerRoutes.use(globalRoutes);
customerRoutes.use(walletRoutes);

export default customerRoutes;
