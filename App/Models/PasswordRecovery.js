// Node Modules
const mongoose = require('mongoose');

const PasswordRecovery = mongoose.Schema(
{
    Email: { type: String, required: true },
    Token: { type: String, required: true },
    Expired: { type: Boolean, default: false }
}, { timestamps: { updatedAt: false } });

module.exports = mongoose.model('PasswordRecovery', PasswordRecovery);
