const pool = require('../database');

/* ***************************
 *  Get all reviews by account_id
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r 
      JOIN public.account AS a 
      ON r.account_id = a.account_id 
      WHERE r.account_id = $1`,
      [account_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getReviewsByAccountId error ' + error);
  }
}

/* ***************************
 *  Get all reviews by inv_id
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r 
      JOIN public.account AS a 
      ON r.account_id = a.account_id 
      WHERE r.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getReviewsByInvId error ' + error);
  }
}

/* ***************************
 *  Get review by review_id
 * ************************** */
async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r 
      JOIN public.account AS a 
      ON r.account_id = a.account_id 
      WHERE r.review_id = $1`,
      [review_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error('getReviewById error ' + error);
  }
}

/* ***************************
 *  Add New Review to Database
 * ************************** */
async function addReview(review_title, review_text, account_id) {
  try {
    const sql =
      'INSERT INTO review (review_title, review_text, review_rating, account_id, inv_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await pool.query(sql, [
      review_title,
      review_text,
      review_rating,
      account_id,
      inv_id,
    ]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

/* ***************************
 *  Update Review in Database
 * ************************** */
async function updateReview(
  review_id,
  review_title,
  review_text,
  review_rating
) {
  try {
    const sql =
      'UPDATE review SET review_title = $1, review_text = $2, review_rating = $3 WHERE review_id = $4 RETURNING *';
    const result = await pool.query(sql, [
      review_title,
      review_text,
      review_rating,
      review_id,
    ]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

/* ***************************
 *  Delete Review from Database
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM review WHERE review_id = $1 RETURNING *';
    const result = await pool.query(sql, [review_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

module.exports = {
  getReviewsByAccountId,
  getReviewsByInvId,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
};
