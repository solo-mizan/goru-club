const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Deposit = require('../models/Deposit');
const Member = require('../models/Member');

// @route   GET api/deposits
// @desc    Get all deposits
// @access  Public
router.get('/', async (req, res) => {
    try {
        const deposits = await Deposit.find()
            .sort({ date: -1 })
            .populate('member', 'name phoneNumber');
        res.json(deposits);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/deposits/:id
// @desc    Get deposit by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id)
            .populate('member', 'name phoneNumber');

        if (!deposit) {
            return res.status(404).json({ msg: 'Deposit not found' });
        }

        res.json(deposit);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Deposit not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/deposits/member/:memberId
// @desc    Get deposits by member ID
// @access  Public
router.get('/member/:memberId', async (req, res) => {
    try {
        const deposits = await Deposit.find({ member: req.params.memberId })
            .sort({ date: -1 });

        res.json(deposits);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/deposits
// @desc    Create a new deposit
// @access  Private
router.post(
    '/',
    [
        check('member', 'Member is required').not().isEmpty(),
        check('amount', 'Amount is required and must be a positive number').isFloat({ min: 1 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { member, amount, date, status, notes } = req.body;

        try {
            // Check if member exists
            const memberExists = await Member.findById(member);
            if (!memberExists) {
                return res.status(404).json({ msg: 'Member not found' });
            }

            const newDeposit = new Deposit({
                member,
                amount,
                date: date || Date.now(),
                status: status || 'approved',
                notes: notes || ''
            });

            const deposit = await newDeposit.save();

            // Populate member info for response
            const populatedDeposit = await Deposit.findById(deposit._id)
                .populate('member', 'name phoneNumber');

            res.json(populatedDeposit);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/deposits/:id
// @desc    Update a deposit
// @access  Private
router.put('/:id', async (req, res) => {
    const { amount, date, status, notes } = req.body;

    // Build deposit object
    const depositFields = {};
    if (amount) depositFields.amount = amount;
    if (date) depositFields.date = date;
    if (status) depositFields.status = status;
    if (notes !== undefined) depositFields.notes = notes;

    try {
        let deposit = await Deposit.findById(req.params.id);

        if (!deposit) {
            return res.status(404).json({ msg: 'Deposit not found' });
        }

        deposit = await Deposit.findByIdAndUpdate(
            req.params.id,
            { $set: depositFields },
            { new: true }
        ).populate('member', 'name phoneNumber');

        res.json(deposit);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Deposit not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/deposits/:id
// @desc    Delete a deposit
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);

        if (!deposit) {
            return res.status(404).json({ msg: 'Deposit not found' });
        }

        await deposit.deleteOne();
        res.json({ msg: 'Deposit removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Deposit not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/deposits/summary
// @desc    Get deposit summary statistics
// @access  Public
router.get('/summary/stats', async (req, res) => {
    try {
        // Total deposits
        const deposits = await Deposit.find({ status: 'approved' });
        const totalDeposit = deposits.reduce((total, deposit) => total + deposit.amount, 0);

        // Member count with deposits
        const memberIdsWithDeposits = [...new Set(deposits.map(deposit =>
            deposit.member.toString()
        ))];

        // Total member count
        const totalMembers = await Member.countDocuments();

        // Latest deposits
        const latestDeposits = await Deposit.find()
            .sort({ date: -1 })
            .limit(5)
            .populate('member', 'name');

        res.json({
            totalDeposit,
            membersWithDeposits: memberIdsWithDeposits.length,
            totalMembers,
            latestDeposits
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 