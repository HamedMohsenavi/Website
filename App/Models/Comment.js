// Node Modules
const mongoose = require('mongoose');

// Helpers
const Pagination = require('App/Helpers/Pagination');

const Schema = mongoose.Schema;

const Comment = Schema(
{
    Account: { type: Schema.Types.ObjectId, ref: 'Account' },
    Parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    Course: { type: Schema.Types.ObjectId, ref: 'Course', default: undefined },
    Episode: { type: Schema.Types.ObjectId, ref: 'Episode', default: undefined },
    Approved: { type: Boolean, default: false },
    Comment: { type: String, require: true }
}, { timestamps: true, toJSON: { virtuals: true } });

Comment.plugin(Pagination);

module.exports = mongoose.model('Comment', Comment);
