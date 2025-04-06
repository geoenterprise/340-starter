// Needed Resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const regValidate = require('../utilities/account-validation');

// Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);

// Route to build account management view
router.get(
  '/',
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(accountController.buildManagementView)
);

//Process registration
router.post(
  '/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  '/update/:accountId',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
);

router.post(
  '/update',
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Update password
router.post(
  '/update-password',
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Route to process logout
router.get('/logout', utilities.handleErrors(accountController.logout));

module.exports = router;
