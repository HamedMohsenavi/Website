// Node Modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Helpers
const Unique = require('App/Helpers/Unique');

const Account = mongoose.Schema(
{
    Name: { type: String, required: true },
    Admin: { type: Boolean, default: false },
    Email: { type: String, unique: true, required: true },
    Password: { type: String, required: true },
    Remember: { type: String, default: null }
}, { timestamps: true });

Account.pre('save', function(Next)
{
    this.Password = bcrypt.hashSync(this.Password, bcrypt.genSaltSync(15));
    Next();
});

Account.pre('findOneAndUpdate', function(Next)
{
    this.getUpdate().$set.Password = bcrypt.hashSync(this.getUpdate().$set.Password, bcrypt.genSaltSync(15));
    Next();
});

Account.methods.ComparePassword = function(Password)
{
    return bcrypt.compareSync(Password, this.Password);
};

Account.methods.SetRemember = function(Response)
{
    const Token = Unique.String(30);

    Response.cookie('Remember', Token, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true, signed: true });

    this.updateOne({ Remember: Token }, Error =>
    {
        if (Error)
            return Logger.Analyze('DBError', Error);
    });
};

module.exports = mongoose.model('Account', Account);
