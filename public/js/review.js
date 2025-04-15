'use strict';

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector('#classificationList');
classificationList.addEventListener('change', function () {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = '/inv/getInventory/' + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error('Network response was not OK');
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log('There was a problem: ', error.message);
    });
});

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById('reviewDisplay');
  // Set up the table labels
  let dataTable = '<thead>';
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
  dataTable += '</thead>';
  // Set up the table body
  dataTable += '<tbody>';
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.inv_id + ', ' + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/review/getReviews/${element.inv_id}' title='Click to view'>View Reviews -</a></td>`;
    dataTable += `<td><a href='/review/addReview/${element.inv_id}' title='Click to add'> Add Review -</a></td>`;
    dataTable += `<td><a href='/review/updateReview/${element.review_id}?inv_id=${element.inv_id}' title='Click to edit'> Update Review -</a></td>`;
    dataTable += `<td><a href='/review/delete-confirm/${element.review_id}?inv_id=${element.inv_id}' title='Click to delete'> Delete Review</a></td></tr>`;
  });
  dataTable += '</tbody>';
  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable;
}

document.addEventListener('DOMContentLoaded', function () {
  const starRatings = document.querySelectorAll('.star-rating');

  starRatings.forEach((starRating) => {
    const rating = starRating.getAttribute('data-rating');
    starRating.style.setProperty('--rating', rating);
  });
});
