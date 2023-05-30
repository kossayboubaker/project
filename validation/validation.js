const { check } = require('express-validator');

exports.registerValidation = [
    check('nom').not().isEmpty().withMessage('First name is required'),
    check('prenom').not().isEmpty().withMessage('Last name is required'),
    check('email').not().isEmpty().withMessage('Gender is required').isIn(['M', 'F']),
    check('date_of_birth').toDate().optional({ checkFalsy: true }),
    check('num').optional({ checkFalsy: true }).isInt(),
    check('address').optional({ checkFalsy: true, nullable: true }).isLength({ min: 10 }).withMessage('Please enter minimum 10 characters'),
    check('email').optional({ checkFalsy: true, nullable: true }).isEmail().withMessage('Please enter valid email')
]