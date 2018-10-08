// Node Native
const path = require('path');

// Node Modules
const { check } = require('express-validator/check');

// Models
const Course = require('App/Models/Course');

class AdminValidator
{
    CreateAndEditCourse()
    {
        return [
            check('Title').not().isEmpty().withMessage('Please enter a valid title'),
            check('Slug').not().isEmpty().withMessage('Please enter a valid Slug').custom(async(value, { req }) =>
            {
                if (req.query._Method === 'PUT')
                {
                    const _Course = await Course.findById(req.params.ID);

                    if (_Course.Slug === value)
                        return;
                }

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
            check('Image').custom(async(value, { req }) =>
            {
                if (req.query._Method === 'PUT' && value === undefined)
                    return;

                if (!value)
                    throw new Error('Please select a image file');

                let Extensions = ['.png', '.jpg', '.jpeg', '.svg'];

                if (!Extensions.includes(path.extname(value.toLowerCase())))
                    throw new Error('Please select a valid image file');
            }),
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
