// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get('/detail/:id', utilities.handleErrors(invController.buildById));

router.get(
  '/management',
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildInvManagement)
);

router.get(
  '/addClass',
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassificationView)
);
router.post(
  '/addClass',
  utilities.checkJWTToken,
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.buildAddClassification)
);

router.get(
  '/addInv',
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventoryView)
);
router.post(
  '/addInv',
  utilities.checkJWTToken,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.buildAddInventory)
);

router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  '/editInv/:id',
  utilities.handleErrors(invController.buildEditInventoryView)
);

router.post(
  '/editInv',
  utilities.checkJWTToken,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  '/delete/:id',
  utilities.handleErrors(invController.buildDeleteInventoryView)
);

router.post(
  '/deleteInv',
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
