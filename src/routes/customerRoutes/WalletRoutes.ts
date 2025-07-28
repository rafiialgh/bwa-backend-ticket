import express from 'express';
import { getBalance, getTopUpHistory, topUpBalance } from '../../controllers/WalletController';
import { validateRequest } from '../../middleware/validateRequest';
import { topupSchema } from '../../utils/zodSchema';

const walletRoutes = express.Router();


walletRoutes.get('/check-balance', getBalance)
walletRoutes.get('/topup-history', getTopUpHistory)
walletRoutes.post('/topup', validateRequest(topupSchema), topUpBalance)

export default walletRoutes;
