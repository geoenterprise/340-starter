// Needed Resources
const express = require('express');
const router = new express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities/');
const reviewValidate = require('../utilities/review-validation');
// const regValidate = require('../utilities/account-validation');

router.get(
  '/management',
  utilities.checkJWTToken,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.buildReviewView)
);

router.get(
  '/addReview/:inv_id',
  utilities.checkJWTToken,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.buildAddReview)
);

router.post(
  '/addReview',
  utilities.checkJWTToken,
  utilities.checkClientAccess,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

router.get(
  '/updateReview/:reviewId',
  utilities.checkJWTToken,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.buildUpdateReview)
);

router.post(
  '/updateReview',
  utilities.checkJWTToken,
  utilities.checkClientAccess,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

router.get(
  '/delete-confirm/:reviewId',
  utilities.checkJWTToken,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.deleteReview)
);

router.post(
  '/deleteReview',
  utilities.checkJWTToken,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.deleteReviewProcess)
);

router.get(
  '/view/:reviewId',
  utilities.checkJWTToken,
  utilities.checkClientAccess,
  utilities.handleErrors(reviewController.viewReview)
);

module.exports = router;
