// Node Modules
const mongoose = require('mongoose');

// Helpers
const Pagination = require('App/Helpers/Pagination');

const Schema = mongoose.Schema;

const Permission = Schema(
{
    Name: { type: String, required: true },
    Label: { type: String, required: true }
}, { timestamps: true, toJSON: { virtuals: true } });

Permission.plugin(Pagination);

Permission.virtual('Roles', { ref: 'Role', localField: '_id', foreignField: 'Permissions' });

module.exports = mongoose.model('Permission', Permission);
