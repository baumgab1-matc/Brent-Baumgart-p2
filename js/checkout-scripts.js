//helper method to get element by id
function get(element) {
    return document.getElementById(element);
}

//get customer cart array from local storage
var retrievedDataAsString = localStorage.getItem('customerCart');

//parse data back to object
var customerCart = JSON.parse(retrievedDataAsString);

//creates and populates table with customer purchases
function checkoutTable() {

    if (customerCart == null || customerCart.length == 0) {
        get('checkout-text').innerHTML = "No items added in cart!";
        return;
    }

    var table = get('checkout-table');
    table.style.visibility = 'visible';

    for (var i = 0; i < customerCart.length; i++) {
        var product = customerCart[i];

        var row = table.insertRow(1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        cell1.innerHTML = product.name;
        cell2.innerHTML = "$" + product.price;
    }

    //update table with total cost for last row
    var lastRow = table.insertRow(-1);
    var cell1 = lastRow.insertCell(-1);
    var cell2 = lastRow.insertCell(-1);

    cell1.innerHTML = "TOTAL:";
    cell2.innerHTML = "$" + calculateTotal();
    

    get('table-container').appendChild(table);

    //show proceed to order button
    get('place-order-button').style.visibility = 'visible';
}

function calculateTotal() {
    var total = 0;

    for (var i = 0; i < customerCart.length; i++) {
        total += customerCart[i].price;
    }

    return total;
}

function submitOrder() {
    window.alert('Order Placed!');
    localStorage.clear();
    window.location.href = 'index.html';
}

window.addEventListener('load', function() {
    checkoutTable();
});