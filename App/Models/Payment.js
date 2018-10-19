// Node Modules
const mongoose = require('mongoose');

// Helpers
const Pagination = require('App/Helpers/Pagination');

const Schema = mongoose.Schema;

const Payment = Schema(
{
    Account: { type: Schema.Types.ObjectId, ref: 'Account' },
    Course: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
    Vip: { type: Boolean, default: false },
    Authority: { type: String, required: true },
    Price: { type: Number, required: true },
    Payment: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true } });

Payment.plugin(Pagination);

module.exports = mongoose.model('Payment', Payment);
