const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const CowPurchase = require('../models/CowPurchase');
const Member = require('../models/Member');
const path = require('path');
const fs = require('fs');

// @route   GET api/cow-purchases
// @desc    Get all cow purchases
// @access  Public
router.get('/', async (req, res) => {
    try {
        const cowPurchases = await CowPurchase.find()
            .sort({ date: -1 })
            .populate('participatingMembers', 'name');
        res.json(cowPurchases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/cow-purchases/:id
// @desc    Get cow purchase by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const cowPurchase = await CowPurchase.findById(req.params.id)
            .populate('participatingMembers', 'name phoneNumber');

        if (!cowPurchase) {
            return res.status(404).json({ msg: 'Cow purchase not found' });
        }

        res.json(cowPurchase);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Cow purchase not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/cow-purchases
// @desc    Create a new cow purchase
// @access  Private
router.post(
    '/',
    [
        check('amount', 'Amount is required and must be a positive number').isFloat({ min: 1 }),
        check('participatingMembers', 'At least one participating member is required').isArray({ min: 1 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount, date, participatingMembers, notes } = req.body;
        let receiptImage = '';

        try {
            // Upload receipt image if provided
            if (req.files && req.files.receipt) {
                const file = req.files.receipt;
                const fileName = `cow_purchase_${Date.now()}${path.extname(file.name)}`;
                const uploadPath = path.join(__dirname, '../../../public/uploads', fileName);

                // Ensure directory exists
                const dir = path.dirname(uploadPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // Move file
                await file.mv(uploadPath);
                receiptImage = `/uploads/${fileName}`;
            }

            const newCowPurchase = new CowPurchase({
                amount,
                date: date || Date.now(),
                participatingMembers,
                notes: notes || '',
                receiptImage
            });

            const cowPurchase = await newCowPurchase.save();

            // Populate member info for response
            const populatedCowPurchase = await CowPurchase.findById(cowPurchase._id)
                .populate('participatingMembers', 'name');

            res.json(populatedCowPurchase);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/cow-purchases/:id
// @desc    Update a cow purchase
// @access  Private
router.put('/:id', async (req, res) => {
    const { amount, date, participatingMembers, notes } = req.body;

    // Build cow purchase object
    const cowPurchaseFields = {};
    if (amount) cowPurchaseFields.amount = amount;
    if (date) cowPurchaseFields.date = date;
    if (participatingMembers) cowPurchaseFields.participatingMembers = participatingMembers;
    if (notes !== undefined) cowPurchaseFields.notes = notes;

    try {
        let cowPurchase = await CowPurchase.findById(req.params.id);

        if (!cowPurchase) {
            return res.status(404).json({ msg: 'Cow purchase not found' });
        }

        // Upload receipt image if provided
        if (req.files && req.files.receipt) {
            const file = req.files.receipt;
            const fileName = `cow_purchase_${Date.now()}${path.extname(file.name)}`;
            const uploadPath = path.join(__dirname, '../../../public/uploads', fileName);

            // Ensure directory exists
            const dir = path.dirname(uploadPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Move file
            await file.mv(uploadPath);
            cowPurchaseFields.receiptImage = `/uploads/${fileName}`;

            // Delete old receipt if exists
            if (cowPurchase.receiptImage) {
                const oldPath = path.join(__dirname, '../../../public', cowPurchase.receiptImage);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        cowPurchase = await CowPurchase.findByIdAndUpdate(
            req.params.id,
            { $set: cowPurchaseFields },
            { new: true }
        ).populate('participatingMembers', 'name');

        res.json(cowPurchase);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Cow purchase not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/cow-purchases/:id
// @desc    Delete a cow purchase
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const cowPurchase = await CowPurchase.findById(req.params.id);

        if (!cowPurchase) {
            return res.status(404).json({ msg: 'Cow purchase not found' });
        }

        // Delete receipt image if exists
        if (cowPurchase.receiptImage) {
            const imagePath = path.join(__dirname, '../../../public', cowPurchase.receiptImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await cowPurchase.deleteOne();
        res.json({ msg: 'Cow purchase removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Cow purchase not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/cow-purchases/summary
// @desc    Get cow purchase summary statistics
// @access  Public
router.get('/summary/stats', async (req, res) => {
    try {
        // Total cow purchases
        const cowPurchases = await CowPurchase.find();
        const totalCowPurchases = cowPurchases.length;

        // Total amount spent
        const totalAmountSpent = cowPurchases.reduce((total, purchase) => total + purchase.amount, 0);

        // Latest cow purchase
        const latestCowPurchase = await CowPurchase.findOne()
            .sort({ date: -1 })
            .populate('participatingMembers', 'name');

        res.json({
            totalCowPurchases,
            totalAmountSpent,
            latestCowPurchase
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 