const e = require('connect-flash');
const reviewModel = require('../models/review-model');
const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');
require('dotenv').config();

const reviewCont = {};

/* ****************************************
 *  Deliver Review view
 * *************************************** */
reviewCont.buildReviewView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const messages = req.flash();
  res.render('./review/management', {
    title: 'Review',
    nav,
    messages,
    errors: null,
    account_id: req.session.accountData.account_id,
    classificationList,
  });
};

/* ***************************
 *  Get Reviews by Inventory ID
 * ************************** */
reviewCont.getReviewsByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const reviews = await reviewModel.getReviewsByInvId(inv_id);
    res.status(200).json(reviews); // Return reviews as JSON
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Internal Server Error');
  }
};

/* ****************************************
 *  Deliver Add Review view
 * *************************************** */
reviewCont.buildAddReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const messages = req.flash();
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryById(inv_id);

  res.render('./review/addReview', {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    messages,
    errors: null,
    inv_id,
  });
};

/* ****************************************
 *  Process Add Review
 * *************************************** */
reviewCont.addReview = async function (req, res) {
  try {
    const { review_title, review_text, review_rating, inv_id } = req.body;
    const account_id = req.session.accountData.account_id;

    const result = await reviewModel.addReview(
      review_title,
      review_text,
      review_rating,
      account_id,
      inv_id
    );

    if (result) {
      req.flash('notice', 'Review added successfully!');
      res.redirect('/inv/detail/' + inv_id);
    } else {
      req.flash('error', 'Failed to add review.');
      res.redirect('/review/addReview/' + inv_id);
    }
  } catch (error) {
    console.error('Error adding review:', error);
    req.flash('error', 'An error occurred while adding the review.');
    res.status(500).redirect('/review/addReview/' + inv_id);
  }
};
/* ****************************************
 *  Deliver Update Review view
 * *************************************** */
reviewCont.buildUpdateReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const messages = req.flash();
  const reviewId = req.params.reviewId;
  const invId = req.query.inv_id;

  try {
    const reviewData = await reviewModel.getReviewById(reviewId, invId);

    if (reviewData) {
      const { review_id, review_title, review_text, review_rating } =
        reviewData;
      res.render('./review/updateReview', {
        title: 'Update Review',
        nav,
        review_id,
        review_title,
        review_text,
        review_rating,
        inv_id: invId,
        messages,
      });
    } else {
      req.flash('notice', 'Review not found for the selected vehicle.');
      res.redirect('/review/management');
    }
  } catch (error) {
    console.error('Error retrieving review:', error);
    req.flash('notice', 'Error retrieving review. Please try again.');
    res.status(500).render('./review/review', {
      title: 'Review',
      nav,
      messages: null,
    });
  }
};
/* ****************************************
 *  Process Update Review
 * *************************************** */
reviewCont.updateReview = async function (req, res) {
  let nav = await utilities.getNav();
  const { review_id, review_title, review_text, review_rating, inv_id } =
    req.body;
  const accountId = req.session.accountData.account_id;

  const updatedReview = {
    review_id,
    review_title,
    review_text,
    review_rating,
    account_id: accountId,
    inv_id,
  };

  try {
    const result = await reviewModel.updateReview(updatedReview);

    if (result.rowCount > 0) {
      req.flash('notice', 'Review updated successfully!');
      res.redirect('/review/management');
    } else {
      req.flash('notice', 'Error updating review. Please try again.');
      res.status(500).render('./review/updateReview', {
        title: 'Update Review',
        nav,
        review_id,
        review_title,
        review_text,
        review_rating,
        inv_id,
        messages: req.flash(),
      });
    }
  } catch (error) {
    console.error('Error updating review:', error);
    req.flash('notice', 'Error updating review. Please try again.');
    res.status(500).render('./review/updateReview', {
      title: 'Update Review',
      nav,
      review_id,
      review_title,
      review_text,
      review_rating,
      inv_id,
      messages: req.flash(),
    });
  }
};
/* ****************************************
 *  Deliver Delete Review view
 * *************************************** */
reviewCont.buildDeleteReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const reviewId = req.params.reviewId;
  const invId = req.query.inv_id;
  const messages = req.flash();

  try {
    const reviewData = await reviewModel.getReviewById(reviewId, invId);

    if (reviewData) {
      const { review_id, review_title, review_text, review_rating } =
        reviewData;
      res.render('./review/delete-confirm', {
        title: 'Delete Review',
        nav,
        review_id,
        review_title,
        review_text,
        review_rating,
        inv_id: invId,
        messages,
      });
    } else {
      req.flash('notice', 'Review not found.');
      res.redirect('/review/management');
    }
  } catch (error) {
    console.error('Error building delete confirmation page:', error);
    req.flash('notice', 'Error loading delete confirmation page.');
    res.redirect('/review/management');
  }
};

/* ****************************************
 *  Process Delete Review
 * *************************************** */
reviewCont.deleteReview = async function (req, res, next) {
  const { review_id } = req.body;

  try {
    const deleteResult = await reviewModel.deleteReview(review_id);
    if (deleteResult) {
      req.flash('notice', 'Review successfully deleted.');
      res.redirect('/review/management');
    } else {
      req.flash('notice', 'Error deleting review. Please try again.');
      res.redirect('/review/delete-confirm');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    req.flash('notice', 'Error deleting review. Please try again.');
    res.redirect('/review/delete-confirm');
  }
};
/* ****************************************
 *  Deliver View Review view
 * *************************************** */
reviewCont.viewReview = async function (req, res) {
  let nav = await utilities.getNav();
  const reviewId = req.params.reviewId;
  try {
    const reviewData = await reviewModel.getReviewById(reviewId);
    if (reviewData) {
      res.render('./review/reviewsView', {
        title: 'View Review',
        nav,
        reviewData,
      });
    } else {
      req.flash('notice', 'Review not found.');
      res.redirect('/review/');
    }
  } catch (error) {
    req.flash('notice', 'Error retrieving review. Please try again.');
    res.status(500).render('./review/review', {
      title: 'Review',
      nav,
      messages: null,
    });
  }
};

/* ****************************************
 *  Build View by Account ID
 * *************************************** */
reviewCont.buildViewByAccountId = async function (req, res) {
  let nav = await utilities.getNav();
  const accountId = req.params.accountId;
  const messages = req.flash();
  try {
    const reviews = await reviewModel.getReviewsByAccountId(accountId);
    const myReviews = await utilities.buildMyReviews(reviews);
    res.render('./review/reviewsView', {
      title: 'My Reviews',
      nav,
      messages,
      myReviews,
    });
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    req.flash('notice', 'Error retrieving reviews. Please try again.');
    res.status(500).render('./review/reviewsView', {
      title: 'My Reviews',
      nav,
      messages: null,
      myReviews: null,
    });
  }
};

module.exports = reviewCont;
