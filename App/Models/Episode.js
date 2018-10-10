// Node Modules
const mongoose = require('mongoose');

// Helpers
const Pagination = require('App/Helpers/Pagination');

const Schema = mongoose.Schema;

const Episode = Schema(
{
    Course: { type: Schema.Types.ObjectId, ref: 'Course' },
    Title: { type: String, required: true },
    Type: { type: String, required: true },
    Description: { type: String, required: true },
    Time: { type: String, required: true },
    FileName: { type: String, required: true },
    EpisodeNumber: { type: Number, required: true },
    DownloadCount: { type: Number, default: 0 },
    ViewCount: { type: Number, default: 0 },
    CommentCount: { type: Number, default: 0 }
}, { timestamps: true });

Episode.plugin(Pagination);

module.exports = mongoose.model('Episode', Episode);
