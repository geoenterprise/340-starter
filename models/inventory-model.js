const pool = require('../database/');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    // const data = await pool.query(
    //   `SELECT * FROM public.inventory AS i
    //   JOIN public.classification AS c
    //   ON i.classification_id = c.classification_id
    //   WHERE i.classification_id = $1`,
    //   [classification_id]
    // );
    const sql = `
      SELECT 
        i.inv_id, 
        i.inv_make, 
        i.inv_model, 
        i.inv_year, 
        i.inv_price,
        i.inv_image, 
        i.inv_thumbnail, 
        i.inv_description, 
        c.classification_name, 
        r.review_id
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      LEFT JOIN public.review AS r
      ON i.inv_id = r.inv_id
      WHERE i.classification_id = $1
    `;
    const data = await pool.query(sql, [classification_id]);
    return data.rows;
  } catch (error) {
    console.error('getclassificationsbyid error ' + error);
  }
}

/* ***************************
 *  Get details data by id
 * ************************** */

async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    );
    console.log('Query result:', data.rows);
    return data.rows[0];
  } catch (error) {
    console.error('getInventoryById error ' + error);
  }
}

/* ***************************
 *  Add New Classification to Database
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *';
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}
/* ***************************
 *  Add New Inventory to Database
 * ************************** */
async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_miles,
  inv_price,
  inv_color,
  classification_id
) {
  try {
    const sql =
      'INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, inv_price, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_miles,
      inv_price,
      inv_color,
      classification_id,
    ]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

/* ***************************
 *  Check existing classification name
 * ************************** */

async function checkExistingClassification(classification_name) {
  try {
    const sql =
      'SELECT * FROM public.classification WHERE classification_name = $1';
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_miles,
  inv_price,
  inv_color,
  classification_id
) {
  try {
    const sql =
      'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3,inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_miles = $7, inv_price = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *';
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_miles,
      inv_price,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error('model error: ' + error);
  }
}

async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error('model error: ' + error);
    throw new Error('Delete Inventory Error');
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  checkExistingClassification,
  updateInventory,
  deleteInventory,
};
