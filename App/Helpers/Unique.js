const crypto = require('crypto');

module.exports.String = (Length) =>
{
    if (!Number.isFinite(Length))
        throw new TypeError('Expected a finite number');

    return crypto.randomBytes(Math.ceil(Length / 2)).toString('hex').slice(0, Length);
};
