// Node Modules
const mongoose = require('mongoose');

// Helpers
const Pagination = require('App/Helpers/Pagination');

const Schema = mongoose.Schema;

const Category = Schema(
{
    Name: { type: String, required: true },
    Parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true, toJSON: { virtuals: true } });

Category.plugin(Pagination);

Category.virtual('Children', { ref: 'Category', localField: '_id', foreignField: 'Parent' });

module.exports = mongoose.model('Category', Category);
