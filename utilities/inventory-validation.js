const utilities = require('.');
const { body, validationResult } = require('express-validator');
const inventoryModel = require('../models/inventory-model');
const { parse } = require('dotenv');
const validate = {};

/*  **********************************
 *  Inventory Data Validation Rules
 *  ********************************* */
validate.inventoryRules = () => {
  return [
    // classification_id is required and must be string
    body('classification_id')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please choose a classification'),

    // inv_make is required and must be string
    body('inv_make')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide the vehicle make.'),

    // inv_model is required and must be string
    body('inv_model')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide the vehicle model.'),

    // inv_year is required and must be number
    body('inv_year')
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide the vehicle year.'),

    // inv_description is required and must be string
    body('inv_description')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a short description.'),

    // inv_price is required and must be number
    body('inv_price')
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide the vehicle price.'),

    // inv_miles is required and must be number
    body('inv_miles')
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide the vehicle mileage.'),

    // inv_color is required and must be string
    body('inv_color')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide the vehicle color.'),
  ];
};

/* **********************************
 *  Validate Inventory Data
 *  ********************************* */
validate.checkInvData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList();
    const nav = await utilities.getNav();
    return res.render('./inventory/addInv', {
      title: 'Add Inventory',
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

/* **********************************
 *  Validate Update Data
 *  ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const inv_id = parseInt(req.body.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    const classificationList = await utilities.buildClassificationList(
      itemData.classification_id
    );
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    return res.render('./inventory/editInv', {
      title: 'Edit ' + itemName,
      nav,
      classificationList: classificationList,
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
  }
  next();
};

/* **********************************
 *  Validate Classification Data
 *  ********************************* */
validate.checkClassData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation Errors:', errors.array());
    const nav = await utilities.getNav();
    return res.render('./inventory/addClass', {
      title: 'Add Classification',
      nav,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

/* **********************************
 * Validate Classification Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a new classification name to be added.')
      .custom(async (classification_name) => {
        const existingClassification =
          await inventoryModel.checkExistingClassification(classification_name);
        if (existingClassification) {
          throw new Error('Classification name already exists.');
        }
      }),
  ];
};

module.exports = validate;
