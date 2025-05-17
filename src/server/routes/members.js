const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Member = require('../models/Member');
const Deposit = require('../models/Deposit');

// @route   GET api/members
// @desc    Get all members
// @access  Public
router.get('/', async (req, res) => {
    try {
        const members = await Member.find().sort({ name: 1 });
        res.json(members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/members/with-deposits
// @desc    Get all members with their deposits
// @access  Public
router.get('/with-deposits', async (req, res) => {
    try {
        const members = await Member.find().sort({ name: 1 });

        // Get all deposits
        const deposits = await Deposit.find();

        // Calculate total deposits for each member
        const membersWithDeposits = members.map(member => {
            const memberDeposits = deposits.filter(
                deposit => deposit.member.toString() === member._id.toString()
            );

            const totalDeposit = memberDeposits.reduce(
                (total, deposit) => total + deposit.amount,
                0
            );

            return {
                _id: member._id,
                name: member.name,
                phoneNumber: member.phoneNumber,
                isActive: member.isActive,
                joinDate: member.joinDate,
                totalDeposit
            };
        });

        res.json(membersWithDeposits);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/members/:id
// @desc    Get member by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ msg: 'Member not found' });
        }

        res.json(member);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Member not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/members
// @desc    Create a new member
// @access  Private
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('phoneNumber', 'Phone number is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, phoneNumber, isActive } = req.body;

        try {
            const newMember = new Member({
                name,
                phoneNumber,
                isActive: isActive !== undefined ? isActive : true
            });

            const member = await newMember.save();
            res.json(member);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/members/:id
// @desc    Update a member
// @access  Private
router.put('/:id', async (req, res) => {
    const { name, phoneNumber, isActive } = req.body;

    // Build member object
    const memberFields = {};
    if (name) memberFields.name = name;
    if (phoneNumber) memberFields.phoneNumber = phoneNumber;
    if (isActive !== undefined) memberFields.isActive = isActive;

    try {
        let member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ msg: 'Member not found' });
        }

        member = await Member.findByIdAndUpdate(
            req.params.id,
            { $set: memberFields },
            { new: true }
        );

        res.json(member);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Member not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/members/:id
// @desc    Delete a member
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ msg: 'Member not found' });
        }

        // Check if member has deposits
        const deposits = await Deposit.find({ member: req.params.id });
        if (deposits.length > 0) {
            return res.status(400).json({
                msg: 'Cannot delete member with existing deposits. Deactivate instead.'
            });
        }

        await member.deleteOne();
        res.json({ msg: 'Member removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Member not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 