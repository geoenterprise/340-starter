const utilities = require('.');
const { body, validationResult } = require('express-validator');
const accountModel = require('../models/account-model');
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'), // on error this message is sent.

    // lastname is required and must be string
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body('account_email')
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error('Email exists. Please log in or use different email');
        }
      }),

    // password is required and must be strong password
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/register', {
      errors,
      title: 'Registration',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ************************************
 * Login Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body('account_email')
      .isEmail()
      .notEmpty()
      .withMessage('A valid email is required.'),
    body('account_password').notEmpty().withMessage('Password is required.'),
  ];
};

/* ************************************
 * Check Login Data
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/login', {
      errors,
      title: 'Login',
      nav,
      account_email,
    });
    return;
  }
  next();
};

/* ************************************
 * Update Account Validation Rules
 * ********************************* */

validate.updateAccountRules = () => {
  return [
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'),

    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'),

    body('account_email')
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email,
          req.body.account_id
        );
        if (emailExists) {
          throw new Error('Email exists. Please log in or use different email');
        }
      }),
  ];
};

/* ************************************
 * Check Update Data and return errors or continue to update account
 * ********************************* */

validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/update', {
      errors,
      title: 'Update Account',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ************************************
 * Password Validation Rules
 * ********************************* */
validate.passwordRules = () => {
  return [
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
    body('confirm_password')
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.account_password) {
          throw new Error('Passwords do not match.');
        }
        return true;
      }),
  ];
};

/* ************************************
 * Check Password Data and return errors or continue to update password
 * ********************************* */
validate.checkPasswordData = async (req, res, next) => {
  const { account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/update', {
      errors,
      title: 'Update Password',
      nav,
      account_password,
    });
    return;
  }
  next();
};

module.exports = validate;
