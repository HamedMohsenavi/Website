// Node Modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Activation = Schema(
{
    Account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    Token: { type: String, required: true },
    ExpireToken: { type: Boolean, default: false },
    ExpireTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Activation', Activation);
