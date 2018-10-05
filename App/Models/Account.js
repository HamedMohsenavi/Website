// Node Modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Account = mongoose.Schema(
{
    Name: { type: String, required: true },
    Admin: { type: Boolean, default: false },
    Email: { type: String, unique: true, required: true },
    Password: { type: String, required: true }
}, { timestamps: true });

Account.pre('save', function(Next)
{
    bcrypt.hash(this.Password, bcrypt.genSaltSync(15), (Error, Hash) =>
    {
        if (Error)
            console.log(Error);

        this.Password = Hash;
        Next();
    });
});

module.exports = mongoose.model('account', Account);
