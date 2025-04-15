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
    console.log('Fetched reviews:', data.rows);
    return data.rows;
  } catch (error) {
    console.error('getReviewsByAccountId error ' + error);
    throw error;
  }
}

/* ***************************
 *  Get all reviews by inv_id
 * ************************** */
// async function getReviewsByInvId(inv_id) {
//   try {
//     const data = await pool.query(
//       `SELECT * FROM public.review AS r
//       JOIN public.account AS a
//       ON r.account_id = a.account_id
//       WHERE r.inv_id = $1`,
//       [inv_id]
//     );
//     return data.rows;
//   } catch (error) {
//     console.error('getReviewsByInvId error ' + error);
//   }
// }
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT 
        r.review_id, 
        r.review_title, 
        r.review_text, 
        r.review_rating, 
        r.inv_id, 
        a.account_id, 
        a.account_email
      FROM public.review AS r
      JOIN public.account AS a
      ON r.account_id = a.account_id
      WHERE r.inv_id = $1
    `;
    const data = await pool.query(sql, [inv_id]);
    return data.rows; // Return only the selected fields
  } catch (error) {
    console.error('getReviewsByInvId error ' + error);
    throw error;
  }
}

/* ***************************
 *  Get review by review_id
 * ************************** */
// async function getReviewById(review_id) {
//   try {
//     const data = await pool.query(
//       `SELECT * FROM public.review AS r
//       JOIN public.account AS a
//       ON r.account_id = a.account_id
//       WHERE r.review_id = $1`,
//       [review_id]
//     );
//     return data.rows[0];
//   } catch (error) {
//     console.error('getReviewById error ' + error);
//   }
// }
async function getReviewById(reviewId, invId) {
  try {
    console.log('Fetching review with ID:', reviewId, 'and Vehicle ID:', invId); // Debugging output
    const sql = `
      SELECT r.review_id, r.review_title, r.review_text, r.review_rating, r.account_id, r.inv_id
      FROM public.review AS r
      JOIN public.account AS a
      ON r.account_id = a.account_id
      WHERE r.review_id = $1 AND r.inv_id = $2
    `;
    const result = await pool.query(sql, [reviewId, invId]);
    console.log('Query Result:', result.rows); // Debugging output
    return result.rows[0]; // Return the first row
  } catch (error) {
    console.error('Error fetching review by ID and Vehicle ID:', error);
    throw error;
  }
}
/* ***************************
 *  Add New Review to Database
 * ************************** */
async function addReview(
  review_title,
  review_text,
  review_rating,
  account_id,
  inv_id
) {
  try {
    const sql =
      'INSERT INTO public.review (review_title, review_text, review_rating, account_id, inv_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
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
async function updateReview(updatedReview) {
  const {
    review_id,
    review_title,
    review_text,
    review_rating,
    account_id,
    inv_id,
  } = updatedReview;
  try {
    const sql = `
      UPDATE public.review
      SET review_title = $1, review_text = $2, review_rating = $3
      WHERE review_id = $4 AND account_id = $5 AND inv_id = $6
      RETURNING *;
    `;
    const values = [
      review_title,
      review_text,
      review_rating,
      review_id,
      account_id,
      inv_id,
    ];
    const result = await pool.query(sql, values);
    return result; // Return the result object
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

/* ***************************
 *  Delete Review from Database
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM public.review WHERE review_id = $1 RETURNING *';
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
