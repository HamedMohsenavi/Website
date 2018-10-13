// Node Modules
const { check } = require('express-validator/check');

class HomeValidator
{
    Comment()
    {
        return [
            check('Comment').isLength({ min: 10 }).withMessage('Write 10 characters or more for the Comment')
        ];
    }
}

module.exports = new HomeValidator();
