// Node Modules
const { check } = require('express-validator/check');

class HomeValidator
{
    Comment()
    {
        return [
            check('Description').isLength({ min: 10 }).withMessage('Write 10 characters or more for the Description')
        ];
    }
}

module.exports = new HomeValidator();
