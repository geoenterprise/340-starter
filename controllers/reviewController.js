const e = require('connect-flash');
const reviewModel = require('../models/review-model');
const utilities = require('../utilities/');
require('dotenv').config();

const reviewCont = {};

/* ****************************************
 *  Deliver Review view
 * *************************************** */
reviewCont.buildReviewView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const messages = req.flash();
  res.render('review/review', {
    title: 'Review',
    nav,
    messages,
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
  res.render('review/add-review', {
    title: 'Add Review',
    nav,
    messages,
  });
};

/* ****************************************
 *  Process Add Review
 * *************************************** */
reviewCont.addReview = async function (req, res) {
  let nav = await utilities.getNav();
  const { review_title, review_text, review_rating, inv_id } = req.body;

  if (!inv_id) {
    req.flash('notice', 'No inventory ID provided. Review cannot be added.');
    return res.redirect('/inventory');
  }

  const accountId = req.session.accountData.account_id;

  // Create a new review object
  const newReview = {
    review_title,
    review_rating,
    review_text,
    account_id: accountId,
    inv_id,
  };

  try {
    // Insert the new review into the database
    const result = await reviewModel.addReview(newReview);
    req.flash('notice', 'Review added successfully!');
    res.redirect('/review/view/' + result.insertId);
  } catch (error) {
    req.flash('notice', 'Error adding review. Please try again.');
    res.status(500).render('review/add-review', {
      title: 'Add Review',
      nav,
      messages: null,
    });
  }
};
/* ****************************************
 *  Deliver Update Review view
 * *************************************** */
reviewCont.buildUpdateReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const messages = req.flash();
  const reviewId = req.params.reviewId;
  try {
    const reviewData = await reviewModel.getReviewById(reviewId);
    if (reviewData) {
      res.render('review/update-review', {
        title: 'Update Review',
        nav,
        reviewData,
        messages,
      });
    } else {
      req.flash('notice', 'Review not found.');
      res.redirect('/review/');
    }
  } catch (error) {
    req.flash('notice', 'Error retrieving review. Please try again.');
    res.status(500).render('review/review', {
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
  const { review_id, review_title, review_text } = req.body;
  const accountId = req.session.accountData.account_id;

  // Create an updated review object
  const updatedReview = {
    review_id,
    review_title,
    review_text,
    account_id: accountId,
  };

  try {
    // Update the review in the database
    const result = await reviewModel.updateReview(updatedReview);
    if (result.affectedRows > 0) {
      req.flash('notice', 'Review updated successfully!');
      res.redirect('/review/view/' + review_id);
    } else {
      req.flash('notice', 'Error updating review. Please try again.');
      res.status(500).render('review/update-review', {
        title: 'Update Review',
        nav,
        messages: null,
      });
    }
  } catch (error) {
    req.flash('notice', 'Error updating review. Please try again.');
    res.status(500).render('review/update-review', {
      title: 'Update Review',
      nav,
      messages: null,
    });
  }
};
/* ****************************************
 *  Process Delete Review
 * *************************************** */
reviewCont.deleteReview = async function (req, res) {
  let nav = await utilities.getNav();
  const reviewId = req.params.reviewId;
  try {
    const result = await reviewModel.deleteReview(reviewId);
    if (result.affectedRows > 0) {
      req.flash('notice', 'Review deleted successfully!');
      res.redirect('/review/');
    } else {
      req.flash('notice', 'Error deleting review. Please try again.');
      res.status(500).render('review/review', {
        title: 'Review',
        nav,
        messages: null,
      });
    }
  } catch (error) {
    req.flash('notice', 'Error deleting review. Please try again.');
    res.status(500).render('review/review', {
      title: 'Review',
      nav,
      messages: null,
    });
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
      res.render('review/view-review', {
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
    res.status(500).render('review/review', {
      title: 'Review',
      nav,
      messages: null,
    });
  }
};

module.exports = reviewCont;
