// Node Modules
const { check } = require('express-validator/check');

// Models
const Course = require('App/Models/Course');

class AdminValidator
{
    CreateCourse()
    {
        return [
            check('Title').not().isEmpty().withMessage('Please enter a valid title'),
            check('Slug').not().isEmpty().withMessage('Please enter a valid Slug').custom(async value =>
            {
                let _Course = await Course.findOne({ Slug: this.Slug(value) });

                if (_Course)
                    throw new Error('A course with that slug is already exists');
            }),
            check('Type').not().isEmpty().withMessage('Please select a type').custom(async value =>
            {
                switch (value)
                {
                    case 'Vip':
                    case 'Cash':
                    case 'Free':
                        break;

                    default:
                        throw new Error('Please select a valid type');
                }
            }),
            check('Description').isLength({ min: 20 }).withMessage('Write 20 characters or more for the description'),
            check('Price').isNumeric().withMessage('Please enter a valid price'),
            check('Tags').not().isEmpty().withMessage('Please enter a valid tag')
        ];
    }

    Slug(Slug)
    {
        return Slug.replace(/([^a-zA-Z0-9]|-)+/g, '-');
    }
}

module.exports = new AdminValidator();
