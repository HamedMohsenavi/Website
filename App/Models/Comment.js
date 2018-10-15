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
    Description: { type: String, require: true }
}, { timestamps: true, toJSON: { virtuals: true } });

Comment.plugin(Pagination);

const Belongs = doc =>
{
    if (doc.Course)
        return 'Course';
    else if (doc.Episode)
        return 'Episode';
};

Comment.virtual('Children', { ref: 'Comment', localField: '_id', foreignField: 'Parent' });
Comment.virtual('Belongs', { ref: Belongs, localField: Belongs, foreignField: '_id', justOne: true });

module.exports = mongoose.model('Comment', Comment);
