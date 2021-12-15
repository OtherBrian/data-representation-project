// Used to store the order properties for the create-order page
order = {}

// Used to check which page is currently loaded.
host = window.location.origin

// Products Section

// Shows product creation form and hides unnecessary buttons
function showProductCreate(){

    document.getElementById('product-display').style.display = "none"
    document.getElementById('product-update-button').style.display = "none"
    document.getElementById('product-create-button').style.display = "block"
    document.getElementById('product-create-update').style.display = "block"
    document.getElementById("createUpdateProductFormID").style.display = "none"
    document.getElementById('customer-display').style.display = "none"
    document.getElementById('customer-update-button').style.display = "none"
    document.getElementById("createCustomerUpdateFormID").style.display = "none"

}

// Takes the product name and price of the selected product, and adds to the order object (above)
function selectProduct(thisElem, order){

    document.getElementById('orderCreation').style.display = "block"
    document.getElementById('selectedProduct').style.display = "block"

    // After product is selected, hide products and show customers.
    document.getElementById('customer-display').style.display = "block"
    document.getElementById('product-display').style.display = "none"

    var rowElement = thisElem.parentNode.parentNode;
    product = readProductFromRow(rowElement)

    order.product_name = product.product_name
    order.price = product.price
    orderSummary(order)

    // Once a product is selected, show the Customers table.
    populateCustomerTable()

    return order

}

// Takes the values of the selected customer, and adds to the order object (above)
function selectCustomer(thisElem, order){

    document.getElementById('selectedCustomer').style.display = "block"
    document.getElementById('customer-display').style.display = "none"
    document.getElementById('orderButtons').style.display = "block"

    var rowElement = thisElem.parentNode.parentNode;
    customer = readCustomerFromRow(rowElement)

    order.customer_first_name = customer.first_name
    order.customer_last_name = customer.last_name
    order.customer_street_address = customer.street_address
    order.customer_city = customer.city
    order.customer_country = customer.country
    order.customer_email = customer.email
    orderSummary(order)

    return order
}

// Shows the user which product and custom is selected.
function orderSummary(order) {

    document.getElementById('selectedProductName').innerHTML = order.product_name
    document.getElementById('selectedProductPrice').innerHTML = order.price
    document.getElementById('selectedCustomerFirstName').innerHTML = order.customer_first_name
    document.getElementById('selectedCustomerSecondName').innerHTML = order.customer_last_name
    document.getElementById('selectedCustomerStreetAddress').innerHTML = order.customer_street_address
    document.getElementById('selectedCustomerCity').innerHTML = order.customer_city
    document.getElementById('selectedCustomerCountry').innerHTML = order.customer_country
    document.getElementById('selectedCustomerEmail').innerHTML = order.customer_email

}

// Makes a POST call to Flask app.py. This then makes POST call to Shopify store.
function createOrder() {

    $.ajax({
        url: host + "/orders",
        data:JSON.stringify(order),
        method:"POST",
        dataType:"JSON",
        contentType: "application/json; charset=utf-8",
        success:function(result){
            document.getElementById('succesfullOrder').style.display = "block"
            document.getElementById('createdOrderId').innerHTML = result

            showProductDisplay()
            document.getElementById('orderCreation').style.display = "none"

        },
        error:function(xhr,status,error){
            console.log("error"+error)
        }
    })
}

// Loads the form to update the selected product, hides customer related buttons.
function showProductUpdate(thisElem){

    var rowElement = thisElem.parentNode.parentNode;
    product = readProductFromRow(rowElement)
    populateProductForm(product)

    document.getElementById('product-display').style.display = "none"
    document.getElementById('product-update-button').style.display = "block"
    document.getElementById('product-create-button').style.display = "none"
    document.getElementById('product-create-update').style.display = "block"
    document.getElementById('customer-display').style.display = "none"
    document.getElementById('customer-create-button').style.display = "none"

}

// Takes the values from the product selected to be updated.
function readProductFromRow(rowElement){

    product = {}
    product.product_id = rowElement.getAttribute("id");
    product.product_name = rowElement.cells[1].firstChild.textContent
    product.price = rowElement.cells[2].firstChild.textContent
    product.product_description = rowElement.cells[3].firstChild.textContent
    product.product_image_url = rowElement.cells[4].firstChild.textContent

    return product

}

// Populates the update product form with the above values.
function populateProductForm(product){

    var form = document.getElementById('createUpdateProductForm')

    form.querySelector('input[name="product_id"]').value = product.product_id
    form.querySelector('input[name="product_id"]').disabled=true
    form.querySelector('input[name="product_name"]').value = product.product_name
    form.querySelector('input[name="price"]').value = product.price
    form.querySelector('input[name="product_description"]').value = product.product_description
    // If there's no URL entered, I want a backup image URL to be used.
    if (form.querySelector('input[name="product_image_url"]').value.length >= 1) {
        form.querySelector('input[name="product_image_url"]').value = product.product_image_url
    } else {
        form.querySelector('input[name="product_image_url"]').value = "https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/image-missing.png"
    }
}

// Clears the values in the product form so that it's empty for next use.
function clearProductForm() {

        var form = document.getElementById('createUpdateProductForm')

        form.querySelector('input[name="product_id"]').value = ''
        form.querySelector('input[name="product_id"]').disabled = false
        form.querySelector('input[name="product_name"]').value = ''
        form.querySelector('input[name="price"]').value = ''
        form.querySelector('input[name="product_description"]').value = ''
        form.querySelector('input[name="product_image_url"]').value = ''
}

// Makes a POST call to the app.py Flask app to create the product.
function productCreate(){

    product= getProductFromForm()

    $.ajax({
        url: host + "/products",
        data:JSON.stringify(product),
        method:"POST",
        dataType:"JSON",
        contentType: "application/json; charset=utf-8",
        success:function(result){
            populateProductTable()
            showProductDisplay()
            clearProductForm()

        },
        error:function(xhr,status,error){
            console.log("error"+error)
        }
    })

}

// Creates product object from the values in the form, and passes to below function to do PUT call.
function productUpdate(){

    product = getProductFromForm()
    updateProductServer(product)

}

// Makes a PUT call to the app.py Flask app to update the product.
function updateProductServer(product){

   $.ajax({
        url: host + "/products/"+product.product_id,
        data: JSON.stringify(product),
        method: "PUT",
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            updateProductTableRow(product)
            showProductDisplay()
            clearProductForm()

        },
        error: function (xhr, status, error) {
            console.log("error" + error)
        }
    })
}

// Uses the value entered into the filter product box as the maximum price, and does a GET request to the app.
function filterProductTable(){
    // Gets the value set by the user in the filter box.
    filter_price = document.getElementById("filterPrice").value

   $.ajax({
       url: host + "/products/price/" + filter_price,
       method:'GET',
       datatype:'JSON',
       success:function(results){
            for (let i = 1; i < document.getElementById("productTable").rows.length; i++){
                document.getElementById("productTable").rows[i].innerHTML = "";
            }
            for (product of results){
                 addProductToTable(product)
            }
            if (window.location.href.indexOf("viewproducts") > -1) {
                document.getElementById("showAllButton").style.display = "block"
            }
       },
       error:function (xhr,status,error){
           console.log ("error "+error +" code:"+status)
       }

   })

}

// Makes a DELETE call to the flask app.py with the current chosen product's ID.
function productDelete(thisElem){

    var tableElement = document.getElementById('productTable');
    var rowElement = thisElem.parentNode.parentNode;
    var index = rowElement.rowIndex;
    product_id = rowElement.getAttribute("id");

    $.ajax({
        url: host + "/products/"+product_id,
        method:"DELETE",
        dateType:"JSON",
        success:function(result){
            tableElement.deleteRow(index);
        },
        error:function(xhr,status,error){
            console.log(error)
        }
    })

}

// Updates the table rows with new content.
function updateProductTableRow(product){

    rowElement = document.getElementById(product.product_id)
    rowElement.cells[1].firstChild.textContent = product.product_name
    rowElement.cells[2].firstChild.textContent = product.price
    rowElement.cells[3].firstChild.textContent = product.product_description
    rowElement.cells[4].firstChild.textContent = product.product_image_url

}

// Gets the product details entered into the form, and assigns them to a product object.
function getProductFromForm(){

    var form = document.getElementById('createUpdateProductForm')

    var product = {}
    product.product_id = form.querySelector('input[name="product_id"]').value
    product.product_name = form.querySelector('input[name="product_name"]').value
    product.price = form.querySelector('input[name="price"]').value
    product.product_description = form.querySelector('input[name="product_description"]').value
    product.product_image_url = form.querySelector('input[name="product_image_url"]').value

    return product
}

// Shows the table of products, and hides any customer tables on the page.
 function showProductDisplay() {

        document.getElementById('product-display').style.display = "block"
        document.getElementById('product-create-update').style.display = "none"
        document.getElementById('customer-display').style.display = "none"
        document.getElementById('customer-create-update').style.display = "none"
    }

// Gets the values for all of the products in the databse via a GET request to the flask app.py
function populateProductTable(){

   $.ajax({
       url: host + '/products',
       method:'GET',
       datatype:'JSON',
       success:function(results){
            for (product of results){
                 addProductToTable(product)
            }
       },
       error:function (xhr,status,error){
           console.log ("error "+error +" code:"+status)
       }

   })
   document.getElementById("showAllButton").style.display = "none"
}

// Uses the value entered into the filter product box as the maximum price, and does a GET request to the app.
// Used this method so as to show variation in API calls.
function filterProductTable(){
    // Gets the value set by the user in the filter box.
    filter_price = document.getElementById("filterPrice").value

   $.ajax({
       url: host + "/products/price/" + filter_price,
       method:'GET',
       datatype:'JSON',
       success:function(results){
            for (let i = 1; i < document.getElementById("productTable").rows.length; i++){
                document.getElementById("productTable").rows[i].innerHTML = "";
            }
            for (product of results){
                 addProductToTable(product)
            }
            if (window.location.href.indexOf("viewproducts") > -1) {
                document.getElementById("showAllButton").style.display = "block"
            }
       },
       error:function (xhr,status,error){
           console.log ("error "+error +" code:"+status)
       }

   })

}

// Fills each row of the table with the product details acquired via either of the above GET requests.
function addProductToTable(product){
    tableElem = document.getElementById("productTable")
    rowElem = tableElem.insertRow(-1)
    rowElem.setAttribute("id", product.product_id)
    cell1 = rowElem.insertCell(0)
    cell1.innerHTML = product.product_id
    cell2 = rowElem.insertCell(1)
    cell2.innerHTML = product.product_name
    cell3 = rowElem.insertCell(2)
    cell3.innerHTML = product.price
    cell4 = rowElem.insertCell(3)
    // Including a default product description if none is entered.
    if (product.product_description.length >= 1) {
        cell4.innerHTML = product.product_description
    } else {
        cell4.innerHTML = "Description missing."
    }
    // Making this cell an image.
    var img = document.createElement('img')
    img.width = 100
    img.height = 100
    // If no image URL is entered, use this backup URL.
    if (product.product_image_url.length >= 1){
        img.src = product.product_image_url
    } else {
        img.src = "https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/image-missing.png"
    }
    cell5 = rowElem.insertCell(4)
    cell5.append(img)
    // Only slow cells 5-7 if on the create-order page.
    if (window.location.href.indexOf("create-order") > -1) {
        cell6 = rowElem.insertCell(5)
        cell6.innerHTML = '<button onclick="selectProduct(this, order)">Select Product</button>'
        cell7 = rowElem.insertCell(6)
        cell7.innerHTML = '<button onclick="showProductUpdate(this)">Update Product</button>'
        cell8 = rowElem.insertCell(7)
        cell8.innerHTML = '<button onclick="productDelete(this)">Delete Product</button>'
    }
     }


// Customers Section

// Show the customer create form. Hide anything else.
function showCustomerCreate(){

    document.getElementById('customer-display').style.display = "none"
    document.getElementById('customer-update-button').style.display = "none"
    document.getElementById('customer-create-button').style.display = "block"
    document.getElementById('customer-create-update').style.display = "block"
    // Hiding the ID text box when creating customers as it's auto-incremented.
    document.getElementById("createCustomerUpdateFormID").style.display = "none"
    document.getElementById('product-display').style.display = "none"
    document.getElementById('product-update-button').style.display = "none"
    document.getElementById("createUpdateProductFormID").style.display = "none"
    document.getElementById('filterCustomerButtons').style.display = "none"

}

// Show the custoemr update form, hide anything else.
function showCustomerUpdate(thisElem){

    var rowElement = thisElem.parentNode.parentNode;
    customer = readCustomerFromRow(rowElement)
    populateCustomerForm(customer)

    document.getElementById('customer-display').style.display = "none"
    document.getElementById('customer-update-button').style.display = "block"
    document.getElementById('customer-create-button').style.display = "none"
    document.getElementById('customer-create-update').style.display = "block"
    document.getElementById('product-display').style.display = "none"
    document.getElementById('product-create-button').style.display = "none"

}

// Get the values of the currently chosen customer.
function readCustomerFromRow(rowElement){
    customer = {}
    customer.customer_id = rowElement.getAttribute("id");
    customer.first_name = rowElement.cells[1].firstChild.textContent
    customer.last_name = rowElement.cells[2].firstChild.textContent
    customer.street_address = rowElement.cells[3].firstChild.textContent
    customer.city = rowElement.cells[4].firstChild.textContent
    customer.country = rowElement.cells[5].firstChild.textContent
    customer.email = rowElement.cells[6].firstChild.textContent

    return customer

}

// Fill the customer form with the above details for updates.
function populateCustomerForm(customer){

    var form = document.getElementById('createCustomerUpdateForm')

    form.querySelector('input[name="customer_id"]').value = customer.customer_id
    form.querySelector('input[name="customer_id"]').disabled=true
    form.querySelector('input[name="first_name"]').value = customer.first_name
    form.querySelector('input[name="last_name"]').value = customer.last_name
    form.querySelector('input[name="street_address"]').value = customer.street_address
    form.querySelector('input[name="city"]').value = customer.city
    form.querySelector('input[name="country"]').value = customer.country
    form.querySelector('input[name="email"]').value = customer.email
}

// Clear all the fields in the customer form for future use.
function clearCustomerForm() {

    var form = document.getElementById('createCustomerUpdateForm')

    form.querySelector('input[name="customer_id"]').value = ''
    form.querySelector('input[name="customer_id"]').disabled = false
    form.querySelector('input[name="first_name"]').value = ''
    form.querySelector('input[name="last_name"]').value = ''
    form.querySelector('input[name="street_address"]').value = ''
    form.querySelector('input[name="city"]').value = ''
    form.querySelector('input[name="country"]').value = ''
    form.querySelector('input[name="email"]').value = ''
}

// POST call to app.py Flask app to create the customer using values in the form.
function customerCreate(){
    customer= getCustomerFromForm()
    $.ajax({
        url: host + "/customers",
        data:JSON.stringify(customer),
        method:"POST",
        dataType:"JSON",
        contentType: "application/json; charset=utf-8",
        success:function(result){
            populateCustomerTable()
            showCustomerDisplay()
            clearCustomerForm()
        },
        error:function(xhr,status,error){
            console.log("error"+error)
        }
    })
}

// Puts the values from the customer update form into a customer object, and passes to below function to perform the PUT request.
function customerUpdate(){

    customer = getCustomerFromForm()
    updateCustomerServer(customer)

}

// Put request to Flask app.py to update the customer.
function updateCustomerServer(customer){

    $.ajax({
        url: host + "/customers/"+customer.customer_id,
        data: JSON.stringify(customer),
        method: "PUT",
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            updateCustomerTableRow(customer)
            showCustomerDisplay()
            clearCustomerForm()

        },
        error: function (xhr, status, error) {
            console.log("error" + error)
        }
    })
}

// DELETE call to app.py Flask app to delete current customer.
function customerDelete(thisElem){

    var tableElement = document.getElementById('customerTable');
    var rowElement = thisElem.parentNode.parentNode;
    var index = rowElement.rowIndex;
    customer_id = rowElement.getAttribute("id");

    $.ajax({
        url: host + "/customers/"+customer_id,
        method:"DELETE",
        dateType:"JSON",
        success:function(result){
            tableElement.deleteRow(index);
        },
        error:function(xhr,status,error){
            console.log(error)
        }
    })
}

// Gets the details of the customer to be updated.
function updateCustomerTableRow(customer){

    rowElement = document.getElementById(customer.customer_id)
    rowElement.cells[1].firstChild.textContent = customer.first_name
    rowElement.cells[2].firstChild.textContent = customer.last_name
    rowElement.cells[3].firstChild.textContent = customer.street_address
    rowElement.cells[4].firstChild.textContent = customer.city
    rowElement.cells[5].firstChild.textContent = customer.country
    rowElement.cells[6].firstChild.textContent = customer.email
}

// Puts the values present in the form into a customer object.
function getCustomerFromForm(){

    var form = document.getElementById('createCustomerUpdateForm')

    var customer = {}
    customer.customer_id = form.querySelector('input[name="customer_id"]').value
    customer.first_name = form.querySelector('input[name="first_name"]').value
    customer.last_name = form.querySelector('input[name="last_name"]').value
    customer.street_address = form.querySelector('input[name="street_address"]').value
    customer.city = form.querySelector('input[name="city"]').value
    customer.country = form.querySelector('input[name="country"]').value
    customer.email = form.querySelector('input[name="email"]').value
    return customer
}

// Shows the customers table, hides any product table on the page.
function showCustomerDisplay() {

    document.getElementById('customer-display').style.display = "block"
    document.getElementById('customer-create-update').style.display = "none"
    document.getElementById('product-display').style.display = "none"
    document.getElementById('product-create-update').style.display = "none"
    document.getElementById('showAllButton').style.display = "none"

}

// GET request to database to get values for all of the customers.
function populateCustomerTable(){

    $.ajax({
    url: host + '/customers',
    method:'GET',
    datatype:'JSON',
    success:function(results){
            for (customer of results){
                addCustomerToTable(customer)
            }
        },
    error:function (xhr,status,error){
        console.log ("error "+error +" code:"+status)
    }
    })
    document.getElementById('showAllButton').style.display = "none"
}

// Same as above, but uses customer City as a filter on the GET request.
function filterCustomerTableCity(){
    // Get the city entered by the user.
    filter_city = document.getElementById("filterCity").value

   $.ajax({
       url: host + '/customers/city/' + filter_city,
       method:'GET',
       datatype:'JSON',
       success:function(results){
            //var Table = document.getElementById("productTable");
            for (let i = 1; i < document.getElementById("customerTable").rows.length; i++){
                document.getElementById("customerTable").rows[i].innerHTML = "";
            }
            for (customer of results){
                addCustomerToTable(customer)
            }
            document.getElementById('showAllButton').style.display = "block"
       },
       error:function (xhr,status,error){
           console.log ("error "+error +" code:"+status)
       }
   })
}

// Same as above but uses Country as the filter criteria.
function filterCustomerTableCountry(){
    // Get the country entered by the user.
    filter_country = document.getElementById("filterCountry").value

   $.ajax({
       url: host + '/customers/country/' + filter_country,
       method:'GET',
       datatype:'JSON',
       success:function(results){
            //var Table = document.getElementById("productTable");
            for (let i = 1; i < document.getElementById("customerTable").rows.length; i++){
                document.getElementById("customerTable").rows[i].innerHTML = "";
            }
            for (customer of results){
                addCustomerToTable(customer)
            }
            document.getElementById('showAllButton').style.display = "block"
       },
       error:function (xhr,status,error){
           console.log ("error "+error +" code:"+status)
       }
   })
}

// Fills each row of the table with the customer details acquired via either of the above GET requests.
function addCustomerToTable(customer){

    tableElem = document.getElementById("customerTable")
    rowElem = tableElem.insertRow(-1)
    rowElem.setAttribute("id", customer.customer_id)
    cell1 = rowElem.insertCell(0)
    cell1.innerHTML = customer.customer_id
    cell2 = rowElem.insertCell(1)
    cell2.innerHTML = customer.first_name
    cell3 = rowElem.insertCell(2)
    cell3.innerHTML = customer.last_name
    cell4 = rowElem.insertCell(3)
    cell4.innerHTML = customer.street_address
    cell5 = rowElem.insertCell(4)
    cell5.innerHTML = customer.city
    cell6 = rowElem.insertCell(5)
    cell6.innerHTML = customer.country
    cell7 = rowElem.insertCell(6)
    cell7.innerHTML = customer.email
    //If on the create-order page, show sells 7-9
    if (window.location.href.indexOf("create-order") > -1) {

        cell8 = rowElem.insertCell(7)
        cell8.innerHTML = '<button onclick="selectCustomer(this, order)">Select Customer</button>'
        cell9 = rowElem.insertCell(8)
        cell9.innerHTML = '<button onclick="showCustomerUpdate(this)">Update Customer</button>'
        cell10 = rowElem.insertCell(9)
        cell10.innerHTML = '<button onclick="customerDelete(this)">Delete Customer</button>'
    } else {
        // Else just show 7 & 8
        cell8 = rowElem.insertCell(7)
        cell8.innerHTML = '<button onclick="showCustomerUpdate(this)">Update Customer</button>'
        cell9 = rowElem.insertCell(8)
        cell9.innerHTML = '<button onclick="customerDelete(this)">Delete Customer</button>'
    }
 }