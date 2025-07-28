import express from 'express';
import { getCustomer, getTransactions, getWalletTransaction } from '../../controllers/CustomerController';

const customerRoutes = express.Router()

customerRoutes.get('/customers', getCustomer)
customerRoutes.get('/wallet-transactions', getWalletTransaction)
customerRoutes.get('/ticket-transactions', getTransactions)

export default customerRoutes