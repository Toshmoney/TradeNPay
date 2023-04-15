const mongoose = require('mongoose');

const { Schema, model } = mongoose

const WalletSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
}, 
{ timestamps: true }
);

const Wallet = model('Wallet', WalletSchema);

module.exports = Wallet;
