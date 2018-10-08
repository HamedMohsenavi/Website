// Node Modules
const mongoose = require('mongoose');

// Helpers
const Pagination = require('App/Helpers/Pagination');

const Schema = mongoose.Schema;

const Course = Schema(
{
    Account: { type: Schema.Types.ObjectId, ref: 'Account' },
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
}, { timestamps: true });

Course.plugin(Pagination);

module.exports = mongoose.model('Course', Course);
