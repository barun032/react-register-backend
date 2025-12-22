const Record = require('../models/Record');

// @desc    Get Records (Filtered by Type/Part)
// @route   GET /api/records
const getRecords = async (req, res) => {
    try {
        const { registerType, part } = req.query;
        let query = {};
        
        if (registerType) query.registerType = registerType;
        if (part && part !== 'undefined') query.part = part;

        const records = await Record.find(query).sort({ consecutiveNo: 1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new record
// @route   POST /api/records
const createRecord = async (req, res) => {
    try {
        const { registerType, part, receiveRefPart, receiveRefNo, date, dispatchMemoNo, dispatchDate } = req.body;

        // Auto-generate consecutive number
        const lastRecord = await Record.findOne({ registerType, part }).sort({ consecutiveNo: -1 });
        const nextNo = lastRecord ? lastRecord.consecutiveNo + 1 : 1;

        // Determine status: Auto-complete if Receive Register has manual dispatch details
        let newStatus = req.body.status || 'Pending';
        if (registerType === 'Receive Register' && dispatchMemoNo && dispatchDate) {
            newStatus = 'Completed';
        }

        const record = await Record.create({
            ...req.body,
            consecutiveNo: nextNo,
            status: newStatus
        });

        // Link Dispatch entry to original Receive record if applicable
        if (registerType === 'Dispatch Register' && receiveRefPart && receiveRefNo) {
            const targetRefNo = parseInt(receiveRefNo, 10);

            await Record.findOneAndUpdate(
                {
                    registerType: 'Receive Register',
                    part: receiveRefPart,
                    consecutiveNo: targetRefNo
                },
                {
                    $set: {
                        dispatchMemoNo: nextNo.toString(),
                        dispatchDate: date,
                        status: 'Completed'
                    }
                },
                { new: true }
            );
        }

        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update record
// @route   PUT /api/records/:id
const updateRecord = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Auto-complete if dispatch details are added/updated
        if (
            (updateData.dispatchMemoNo && String(updateData.dispatchMemoNo).trim() !== '') &&
            (updateData.dispatchDate && String(updateData.dispatchDate).trim() !== '')
        ) {
            updateData.status = 'Completed';
        }
        
        const record = await Record.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getRecords, createRecord, updateRecord };