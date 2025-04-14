const e = require('connect-flash');
const accountModel = require('../models/account-model');
const utilities = require('../utilities/');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  const messages = req.flash();
  if (req.query.notice) {
    messages.notice = req.query.notice;
  }
  res.render('account/login', {
    title: 'Login',
    nav,
    messages,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/register', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render('account/login', {
      title: 'Login',
      nav,
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/register', {
      title: 'Registration',
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.');
    res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      req.session.loggedin = true;
      req.session.accountData = accountData;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === 'development') {
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie('jwt', accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect('/account/');
    } else {
      req.flash(
        'message notice',
        'Please check your credentials and try again.'
      );
      res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden');
  }
}

/* ****************************************
 *  Deliver Account Management View
 * ************************************ */
async function buildManagementView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const account_firstname = res.locals.accountData.account_firstname;
    res.render('./account/management', {
      title: 'Account Management',
      nav,
      account_firstname,
      accountData: res.locals.accountData,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Deliver Update Account View
 * ************************************ */
async function buildUpdateView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountId = req.params.accountId;
    const accountData = await accountModel.getAccountById(accountId);
    res.render('./account/update', {
      title: 'Update Account',
      nav,
      accountData,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Update Account
 * ************************************ */

async function updateAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountId = req.body.account_id;
    const account_firstname = req.body.account_firstname;
    const account_lastname = req.body.account_lastname;
    const account_email = req.body.account_email;

    const updateResult = await accountModel.updateAccount(
      accountId,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      req.flash('notice', 'Account updated successfully.');
      return res.redirect('/account/');
    } else {
      req.flash('notice', 'Failed to update the account.');
      return res.status(501).render('./account/update', {
        title: 'Update Account',
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Update Password
 * ************************************ */
async function updatePassword(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountId = req.body.account_id;
    const account_password = req.body.account_password;
    const hashedPassword = await bcrypt.hashSync(account_password, 10);

    const updateResult = await accountModel.updatePassword(
      accountId,
      hashedPassword
    );

    if (updateResult) {
      req.flash('notice', 'Password updated successfully.');
      return res.redirect('/account/');
    } else {
      req.flash('notice', 'Failed to update the password.');
      return res.status(501).render('./account/update', {
        title: 'Update Password',
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Logout
 * ************************************ */
async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      req.flash('error', 'There was an issue logging you out.');
      return res.redirect('/account');
    }

    res.clearCookie('jwt');
    return res.redirect('/account/login?notice=You have been logged out.');
  });
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagementView,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout,
};
