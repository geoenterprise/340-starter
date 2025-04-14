const utilities = require('.');
const { body, validationResult } = require('express-validator');
const reviewModel = require('../models/review-model');
const { parse } = require('dotenv');
const validate = {};

//
//  **********************************
//  *  Review Data Validation Rules
//  *  ********************************* */
validate.reviewRules = () => {
  return [
    // review_title is required and must be string
    body('review_title')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a review title.'),

    // review_rating is required and must be number
    body('review_rating')
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage('Please provide a rating.'),

    // review_text is required and must be string
    body('review_text')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a review text.'),
  ];
};

/* ************************************
 * Check Review Data
 * ********************************* */
validate.checkReviewData = async (req, res, next) => {
  const { review_title, review_rating, review_text } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('./review/addReview', {
      errors,
      title: 'Add Review',
      nav,
      review_title,
      review_rating,
      review_text,
    });
    return;
  }
  next();
};

/* ************************************
 * Check Review Ownership
 * ********************************* */
validate.checkReviewOwnership = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const accountId = req.session.accountData.account_id;
  const reviewData = await reviewModel.getReviewById(reviewId);
  if (reviewData.account_id !== accountId) {
    req.flash('notice', 'You do not have permission to edit this review.');
    res.redirect('/review/view/' + reviewId);
    return;
  }
  next();
};

module.exports = validate;
