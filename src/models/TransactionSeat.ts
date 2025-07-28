import mongoose from 'mongoose';

const transactionSeatSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  seat: {
    type: String,
    require: true,
  },
});

export default mongoose.model(
  'TransactionSeat',
  transactionSeatSchema,
  'transactionSeats'
);
