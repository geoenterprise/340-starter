// Needed Resources
const express = require('express');
const router = new express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities/');
const reviewValidate = require('../utilities/review-validation');
// const regValidate = require('../utilities/account-validation');

router.get(
  '/',
  utilities.checkLogin,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.buildReviewView)
);

router.get(
  '/add',
  utilities.checkLogin,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.buildAddReview)
);

router.post(
  '/add',
  utilities.checkLogin,
  utilities.checkAccountType,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

router.get(
  '/update/:reviewId',
  utilities.checkLogin,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.buildUpdateReview)
);

router.post(
  '/update',
  utilities.checkLogin,
  utilities.checkClientAccess,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

router.get(
  '/delete/:reviewId',
  utilities.checkLogin,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.deleteReview)
);

router.get(
  '/view/:reviewId',
  utilities.checkLogin,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.viewReview)
);

module.exports = router;
