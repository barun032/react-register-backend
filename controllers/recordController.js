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
        // 1. Destructure fields from the request
        const { registerType, part, receiveRefPart, receiveRefNo, date } = req.body;

        // 2. Auto-Generate Consecutive Number for the NEW record
        const lastRecord = await Record.findOne({ registerType, part })
                                       .sort({ consecutiveNo: -1 });

        const nextNo = lastRecord ? lastRecord.consecutiveNo + 1 : 1;

        // 3. Create the New Record (Dispatch or Receive)
        const record = await Record.create({
            ...req.body,
            consecutiveNo: nextNo
        });

        // --- 4. AUTOMATIC LINKING LOGIC ---
        // Logic: If we just created a 'Dispatch Register' entry AND it references a 'Receive Register'
        if (registerType === 'Dispatch Register' && receiveRefPart && receiveRefNo) {
            
            console.log(`[LINKING] Dispatch #${nextNo} is replying to ${receiveRefPart} #${receiveRefNo}`);

            // IMPORTANT: Ensure receiveRefNo is treated as a Number for the search query
            const targetRefNo = parseInt(receiveRefNo, 10);

            // Find the original Receive Record and update its "Dispatch Register" columns AND Status
            const updatedReceiveRecord = await Record.findOneAndUpdate(
                {
                    registerType: 'Receive Register', // Target is a Receive Record
                    part: receiveRefPart,             // In the specific Part (e.g., "Part I")
                    consecutiveNo: targetRefNo        // Matching the Ref No provided
                },
                {
                    $set: {
                        // FILL THE "DISPATCH REGISTER" GROUP COLUMNS:
                        dispatchMemoNo: nextNo.toString(), // Fill 'Memo No.' with Dispatch ID
                        dispatchDate: date,                // Fill 'Dispatch Date' with Dispatch Date
                        status: 'Completed'                // <--- CRITICAL: Explicitly set status to Completed
                    }
                },
                { new: true }
            );

            if (updatedReceiveRecord) {
                console.log("SUCCESS: Receive Record linked and marked as 'Completed'.");
            } else {
                console.log("FAILED: Could not find the Receive Record to link.");
            }
        }

        res.status(201).json(record);
    } catch (error) {
        console.error("Create Record Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update record
// @route   PUT /api/records/:id
const updateRecord = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // SAFETY CHECK: If user manually enters a Dispatch Memo No, ensure status becomes Completed
        if (updateData.dispatchMemoNo && String(updateData.dispatchMemoNo).trim() !== '') {
            updateData.status = 'Completed';
        }
        
        const record = await Record.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getRecords, createRecord, updateRecord };