const mongoose = require('mongoose')

const { Schema, model } = mongoose

const TransactionSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true
        },
        amount: {
            type: Number,
            required:  [true, 'transaction amount not indicated']
        },
        type: {
            type: String,
            enum: ['credit', 'debit'],
            required: [true, 'transaction type not indicated']
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
            required: true
        },
        description: {
            type: String,
            required: [true, 'transaction not described']
        },
        reference_number: {
            type: String,
            trim: true,
            required: [true, 'transaction not referenced']
        },
    }, 
    { timestamps: true }
);

const Transaction = model('Transaction', TransactionSchema);

module.exports = Transaction;
  