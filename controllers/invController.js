const e = require('connect-flash');
const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  });
};

/* ***************************
 *  Build by id view
 * ************************** */
invCont.buildById = async function (req, res, next) {
  const id = req.params.id;
  const data = await invModel.getInventoryById(id);
  const detailView = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  res.render('./inventory/detail', {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    detailView,
  });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render('./inventory/management', {
    title: 'Vehicle Management',
    nav,
    errors: null,
    classificationSelect,
  });
};

/* ***************************
 *  Build add Classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/addClass', {
    title: 'Add Classification',
    nav,
    errors: null,
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classification_name = req.body.classification_name;
    const regResult = await invModel.addClassification(classification_name);

    if (regResult) {
      req.flash('notice', 'Classification added successfully.');
      return res.redirect('/inv/management');
    } else {
      req.flash('notice', 'Error adding classification.');
      return res
        .status(500)
        .render('./inventory/addClass', { title: 'Add Classification', nav });
    }
  } catch (error) {
    console.error('Error adding classification:', error);
    res.status(500).send('Internal Server Error');
  }
};

/* ***************************
 *  Build add Inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  const classificationList = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  res.render('./inventory/addInv', {
    title: 'Add Inventory',
    nav,
    classificationList,
    errors: null,
  });
};

/* ***************************
 *  Build add Inventory Data
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();

    // Destructure form data
    const {
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
    } = req.body;

    // Check for missing fields (fallback in case validation middleware fails)
    if (
      !inv_make ||
      !inv_model ||
      !inv_year ||
      !inv_description ||
      !inv_image ||
      !inv_thumbnail ||
      !inv_miles ||
      !inv_price ||
      !inv_color ||
      !classification_id
    ) {
      req.flash('notice', 'All fields are required.');
      return res.status(400).render('./inventory/addInv', {
        title: 'Add Inventory',
        nav,
        classificationList,
        errors: [{ msg: 'All fields are required.' }],
        ...req.body,
      });
    }

    // Attempt to add inventory
    const regResult = await invModel.addInventory(
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
    );

    if (regResult) {
      req.flash('notice', 'Vehicle added successfully.');
      res.redirect('/inv/management');
    } else {
      req.flash(
        'notice',
        'Sorry, there was an error adding the inventory vehicle.'
      );
      res.status(500).render('./inv/addInv', {
        title: 'Add Inventory',
        nav,
        classificationList,
        errors: [{ msg: 'Failed to add inventory. Please try again.' }],
        ...req.body,
      });
    }
  } catch (error) {
    console.error('Error adding inventory:', error);
    req.flash('notice', 'An unexpected error occurred.');
    res.status(500).render('./inv/addInv', {
      title: 'Add Inventory',
      nav: await utilities.getNav(),
      classificationList: await utilities.buildClassificationList(),
      errors: [{ msg: 'An unexpected error occurred. Please try again.' }],
      ...req.body,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error('No data returned'));
  }
};

/****************************
 *  Build edit Inventory view
 * ************************** */
invCont.buildEditInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render('./inventory/editInv', {
    title: 'Edit ' + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();

    // Destructure form data
    const {
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
      classification_id,
    } = req.body;

    // Check for missing fields (fallback in case validation middleware fails)
    if (
      !inv_id ||
      !inv_make ||
      !inv_model ||
      !inv_year ||
      !inv_description ||
      !inv_image ||
      !inv_thumbnail ||
      !inv_miles ||
      !inv_price ||
      !inv_color ||
      !classification_id
    ) {
      req.flash('notice', 'All fields are required.');
      return res.status(400).render('./inventory/editInv', {
        title: 'Edit Inventory',
        nav,
        classificationSelect,
        errors: [{ msg: 'All fields are required.' }],
        ...req.body,
      });
    }

    // Attempt to add inventory
    const updateResult = await invModel.updateInventory(
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
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
      req.flash('notice', `The ${itemName} was successfully updated.`);
      res.redirect('/inv/management');
    } else {
      const itemName = `${inv_make} ${inv_model}`;
      req.flash('notice', 'Sorry, the insert failed.');
      res.status(501).render('./inventory/editInv', {
        title: 'Edit ' + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
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
        classification_id,
      });
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
    req.flash('notice', 'An unexpected error occurred.');
    res.status(500).render('./inventory/editInv', {
      title: 'Edit Inventory',
      nav: await utilities.getNav(),
      classificationSelect: await utilities.buildClassificationList(),
      errors: [{ msg: 'An unexpected error occurred. Please try again.' }],
      ...req.body,
    });
  }
};

module.exports = invCont;
