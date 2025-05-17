const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Virtual for totalDeposits
MemberSchema.virtual('totalDeposits', {
    ref: 'Deposit',
    localField: '_id',
    foreignField: 'member',
    count: false,
    match: { status: 'approved' },
    get: function (deposits) {
        return deposits.reduce((total, deposit) => total + deposit.amount, 0);
    }
});

// Virtual for deposits
MemberSchema.virtual('deposits', {
    ref: 'Deposit',
    localField: '_id',
    foreignField: 'member'
});

module.exports = mongoose.model('Member', MemberSchema); 