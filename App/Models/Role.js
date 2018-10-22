// Node Modules
const mongoose = require('mongoose');

// Helpers
const Pagination = require('App/Helpers/Pagination');

const Schema = mongoose.Schema;

const Role = Schema(
{
    Permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    Name: { type: String, required: true },
    Label: { type: String, required: true }
}, { timestamps: true });

Role.plugin(Pagination);

module.exports = mongoose.model('Role', Role);
