const invModel = require('../models/inventory-model');
const Util = {};
// console.log(data);

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail view HTML
 * ************************************ */

Util.buildDetailView = async function (vehicle) {
  let detailView = `<div class="vehicle-detail">`;
  const mileageText = 'MILEAGE';
  const mileageLabelHTML = mileageText
    .split('')
    .map((letter) => `<span>${letter}</span>`)
    .join('');
  // Left side - Vehicle Image and Thumbnails
  detailView += `
    <div class="vehicle-image-section">
      <img class="main-image" src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="thumbnails">
        <img src="${vehicle.inv_thumbnail}" alt="Thumbnail 1">
        <img src="${vehicle.inv_thumbnail}" alt="Thumbnail 2">
        <img src="${vehicle.inv_thumbnail}" alt="Thumbnail 3">
      </div>
    </div>`;

  // Right side - Vehicle Details

  detailView += `
    <div class="vehicle-info">
      <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
      
      <div class="price-mileage">
        <div class="mileage-box">
          <div class="mileage-label">${mileageLabelHTML}</div>
          <span class="mileage-value">${new Intl.NumberFormat().format(
            vehicle.inv_miles
          )}</span>
        </div>
        <p class="vehicle-price">
          <span class="no-haggle">No-Haggle Price </span>
          <span class="price-amount">$${new Intl.NumberFormat().format(
            vehicle.inv_price
          )}</span>
        </p>
      </div>
      <div class="vehicle-description">
        <div class="vehicle-specs">
          <p><strong>MPG:</strong> 29/37 (City/Highway)</p>
          <p><strong>Ext. Color:</strong> ${vehicle.inv_color}</p>
          <p><strong>Int. Color:</strong> Black</p>
          <p><strong>Fuel Type:</strong> Gasoline</p>
          <p><strong>Transmission:</strong> Xtronic CVT</p>
          <p><strong>Drive Train:</strong> Front Wheel Drive</p>
          <p><strong>VIN:</strong> 3N1AB7AP3KY362032</p>
        </div>

        <div class="vehicle-actions">
          <button class="purchase-btn">Start My Purchase</button>
          <button class="contact-btn">Contact Us</button>
          <button class="testdrive-btn">Schedule Test Drive</button>
          <button class="finance-btn">Apply for Financing</button>
        </div>
      </div>
    </div>`;

  detailView += `</div>`; // Close .vehicle-detail

  return detailView;
};

/* **************************************
 * Build Build Classification List
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += ' selected ';
    }
    classificationList += '>' + row.classification_name + '</option>';
  });
  classificationList += '</select>';
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
