const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    registerType: { type: String, required: true }, // 'Receive Register' or 'Dispatch Register'
    part: { type: String }, // 'Part I', 'Part II' (Only for Receive)
    consecutiveNo: { type: Number, required: true }, // The ID logic you had
    
    // Common Fields
    date: { type: Date },
    subject: { type: String },
    status: { type: String, default: 'Pending' },
    remarks: { type: String },
    reminderDate: {type: Date},
    reminderNumber: {type: String},

    // Receive Specific
    from: { type: String },
    referenceNo: { type: String },
    referenceDate: { type: Date },
    fileNo: { type: String },
    serialNo: { type: String },
    collectionNumber: { type: String },
    fileInCollection: { type: String },
    actionType: { type: String },
    endorsedTo: { type: String },
    
    // Dispatch Specific
    to: { type: String },
    fileSerialNo: { type: String },
    collectionTitle: { type: String },
    replyDetails: { type: String },
    stampRupees: { type: Number },
    stampPaise: { type: Number },
    officerName: { type: String },

    // Linking (Dispatch refers to Receive)
    receiveRefPart: { type: String },
    receiveRefNo: { type: Number },

    // Automated Linking fields
    dispatchMemoNo: { type: String }, // When a Receive record is dispatched
    dispatchDate: { type: Date }

}, { timestamps: true });

// Compound index to ensure unique consecutive numbers per register type/part
recordSchema.index({ registerType: 1, part: 1, consecutiveNo: 1 }, { unique: true });

module.exports = mongoose.model('Record', recordSchema);