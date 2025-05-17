const mongoose = require('mongoose');

const CowPurchaseSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Purchase date is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [1, 'Amount must be at least 1']
    },
    participatingMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }],
    notes: {
        type: String,
        default: ''
    },
    receiptImage: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('CowPurchase', CowPurchaseSchema); 