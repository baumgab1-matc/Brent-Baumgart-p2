
//variable to hold how many items have been added to cart
var inCart = 0;

//product array
var products = [
    {
        name: 'Electric Guitar',
        price: 1800,
        image: 'https://images.pexels.com/photos/92069/pexels-photo-92069.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
        quantity: 2,
        productID: 235333
    },
    {
        name: 'Bass Guitar',
        price: 900,
        image: 'https://images.pexels.com/photos/8285266/pexels-photo-8285266.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=300&w=300',
        quantity: 3,
        productID: 333453
    },
    {
        name: 'Ukulele',
        price: 1500,
        image: 'https://images.pexels.com/photos/2018367/pexels-photo-2018367.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300&h=300',
        quantity: 1,
        productID: 222349
    },
    {
        name: 'Acoustic Guitar',
        price: 1100,
        image: 'https://images.pexels.com/photos/1656415/pexels-photo-1656415.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
        quantity: 1,
        productID: 999984
    }

];

//array to hold what customer has added to cart
var customerCart = [];

//product object
class ProductPackage {
    constructor(product) {
        this.name = product.name;
        this.price = product.price;
        this.image = product.image;
        this.quantity = product.quantity;
        this.selector = product.selector;
        this.productID = product.productID;
    }
}

//function used when button 'Add To Cart' is clicked
function addToCart(product) {

    //product added to cart, decrement quantity
    product.quantity--;

    //get button that corresponds with current product being added
    var button = get('button-' + product.productID);

    //if product is now zero, disable 'add to cart' button
    if (product.quantity <= 0) {
        button.textContent = "sold out";
        button.disabled = true;
    } 
    
    inCart++;

    //update in cart text in main header
    updateHeaderCartText();

    //add product to customers cart
    customerCart.push(product);

    updateLocalStorage();
}


//adds a product to DOM 
function addProduct(product) {
    var productContainer = get('product-list-container');

    //create product header
    var header = document.createElement('header'),
    h2 = document.createElement('h2'),
    h3 = document.createElement('h3');

    h2.textContent = product.name;
    h3.textContent = 'Price: $' + product.price;

    header.appendChild(h2);
    header.appendChild(h3);

    //create section to hold image
    var imageSection = document.createElement('section'),
    img = document.createElement('img');
    img.src = product.image;
    imageSection.appendChild(img);

    //add button to add to cart
    var button = document.createElement('button');
    button.textContent = "Add To Cart";

    //add unique id to button to make it easier to work with on click events
    button.id = 'button-' + product.productID;

    button.onclick = function() {
        addToCart(product);
    }

    //append created elements to product container
    productContainer.appendChild(header);
    productContainer.appendChild(imageSection);
    productContainer.appendChild(button);
}


//loop through all products and add each product to DOM
//NOTE: the problem with not loading data from db is that product quantities are not updated when orders are submitted
function loadProducts() {

    for (var i = 0; i < products.length; i++) {
        var product = new ProductPackage(products[i]);
        addProduct(product);
    }
}


//show modal for editing cart
function editCart() {

    //set css to be visible
    get('modal-dialog').classList.add('visible');
    get('modal-backdrop').classList.add('visible');
  
    //if nothing is in cart, tell customer
    if (customerCart.length === 0) {
        get('customer-order-text').textContent = 'No items in car!';
        return false;
    }

    //add customer orders to a list
    for (var i = 0; i < customerCart.length; i++) {
        //create the elements
        var ul = get('customer-order-list');
        var li = document.createElement('li');
        li.id = 'in-cart-item'; //add id for css

        var textEl = document.createTextNode(customerCart[i].name);

        //create remove button
        var removeButton = document.createElement('button');
        removeButton.id = 'remove-' + i;
        removeButton.innerHTML = 'Remove'

        //add class list for css
        removeButton.classList.add('remove-button');

        //there might be a better way to this, but this is the only way I could figure out 
        //how to keep scope of i correct
        removeButton.onclick = (function(i) {return function() {
            removeFromModal(i);
        };}(i));

        //append everything
        li.appendChild(textEl);
        li.appendChild(removeButton);
        ul.appendChild(li);
    }

    return false;
}

function removeFromModal(idx) { 
    var product = customerCart[idx];

    //remove product from customer cart array
    customerCart.splice(idx, 1);

    //item was removed, decrement inCart count
    inCart--;

    //update in cart text in main header
    updateHeaderCartText();
    
    //item was removed from cart, need to increase its quantity back and check if add to cart button needs to be enabled
    product.quantity++;
    updateAddToCartButton(product);

    //update the list by removing all list elements then recalling editCart
    clearCartList();
    editCart();
}

function closeModal() {
    get('modal-dialog').classList.remove('visible');
    get('modal-backdrop').classList.remove('visible');
    get('customer-order-text').textContent = '';

    //remove child list items from ul.  Otherwise duplicates each order in cart every time edit cart is opened
    clearCartList();

    updateLocalStorage();
}

//empties the entire car
function emptyCart() {

    if (customerCart.length == 0) {
        return;
    }

    //reset inCart count to 0
    inCart = 0;
    
    //loop through and re-add the quantity to each product
    for (var i = 0; i < customerCart.length; i++) {
        var product = customerCart[i];
        product.quantity++;

        //update add to cart button
        updateAddToCartButton(product);
    }

    //empty cart
    customerCart = [];

    //remove child list items from ul.
    clearCartList();

    //update main header in cart text
    updateHeaderCartText();

    //clear local storage
    localStorage.clear();

    //reshow empty cart message
    get('customer-order-text').textContent = 'No items in car!';
}


//helper methods below

//update text in main header that shows how many items in cart at any given time
function updateHeaderCartText() {
    get('in-cart').textContent = '(' + inCart + ')';
}

//reenables a add to cart button if items removed from cart
function updateAddToCartButton(product) {
    var btn = get('button-' + product.productID);

    if (product.quantity > 0) {
        btn.disabled = false;
        btn.innerHTML = "Add To Cart";
    } else {
        btn.disabled = true;
        btn.innerHTML = "Sold out";
    }
}

//clears list items in modal
function clearCartList() {
    var ul = get('customer-order-list');
    while (ul.firstChild) {
         ul.removeChild(ul.firstChild);
    }
}

//updates local storage when customer edits cart or adds item with button
function updateLocalStorage() {
    localStorage.setItem('customerCart', JSON.stringify(customerCart));
}

function get(element) {
    return document.getElementById(element);
}

//on load method
window.addEventListener('load', function() {
    //populate products to screen
    loadProducts();

    //a customer may have hit checkout and then comes back to this page
    //if that is that case need to check local storage and populate customer cart with that
    var retrievedDataAsString = localStorage.getItem('customerCart');

    //parse data back to object
    customerCart = JSON.parse(retrievedDataAsString);

    //if null, then make customer cart empty
    if(customerCart == null) {
        customerCart = [];
    } else {
        inCart = customerCart.length;
        updateHeaderCartText();
        
        for (var i = 0; i < customerCart.length; i++) {
            updateAddToCartButton(customerCart[i]);
        }

    }

});