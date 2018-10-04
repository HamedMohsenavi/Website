// Node Modules
const { check } = require('express-validator/check');

class AuthenticationValidator
{
    Login()
    {
        return [
            check('Email').isEmail().withMessage('Please enter a valid email address.')
        ];
    }

    Registration()
    {
        return [
            check('Name').not().isEmpty().withMessage('Enter your name.'),
            check('Email').isEmail().withMessage('Please enter a valid email address.'),
            check('Password').isLength({ min: 8 }).withMessage('Use 8 characters or more for your password.')
        ];
    }
}

module.exports = new AuthenticationValidator();
