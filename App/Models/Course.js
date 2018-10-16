// Node Modules
const mongoose = require('mongoose');

// Helpers
const Pagination = require('App/Helpers/Pagination');

const Schema = mongoose.Schema;

const Course = Schema(
{
    Account: { type: Schema.Types.ObjectId, ref: 'Account' },
    Categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    Title: { type: String, required: true },
    Slug: { type: String, lowercase: true, required: true },
    Type: { type: String, required: true },
    Description: { type: String, required: true },
    Image: { type: Object, required: true },
    Thumbnail: { type: String, required: true },
    Price: { type: Number, required: true },
    Tags: { type: String, required: true },
    Time: { type: String, default: '00:00:00' },
    CommentCount: { type: Number, default: 0 },
    ViewCount: { type: Number, default: 0 }
}, { timestamps: true, toJSON: { virtuals: true } });

Course.plugin(Pagination);

Course.virtual('Episodes', { ref: 'Episode', localField: '_id', foreignField: 'Course' });
Course.virtual('Comments', { ref: 'Comment', localField: '_id', foreignField: 'Course' });

Course.methods.Path = function()
{
    return `/Course/${this.Slug}`;
};

Course.methods.Increase = async function(Field, Count = 1)
{
    this[Field] += Count;
    await this.save();
};

module.exports = mongoose.model('Course', Course);
