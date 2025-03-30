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
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
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
      'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_miles,
  inv_color,
  inv_price,
  inv_description,
  classification_id
) {
  try {
    const sql =
      'INSERT INTO inventory (inv_make, inv_model, inv_year, inv_miles, inv_color, inv_price, inv_description, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_miles,
      inv_color,
      inv_price,
      inv_description,
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
    const sql = 'SELECT * FROM classification WHERE classification_name = $1';
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  checkExistingClassification,
};
