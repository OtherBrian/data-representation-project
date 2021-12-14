order = {}
host = window.location.origin

// Products Section

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
    populateCustomerTable()
    return order
}

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

function createOrder() {

    $.ajax({
        url: host + "/orders",
        data:JSON.stringify(order),
        method:"POST",
        dataType:"JSON",
        contentType: "application/json; charset=utf-8",
        success:function(result){
            console.log(result)
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
function readProductFromRow(rowElement){
    product = {}
    product.product_id = rowElement.getAttribute("id");
    product.product_name = rowElement.cells[1].firstChild.textContent
    product.price = rowElement.cells[2].firstChild.textContent
    product.product_description = rowElement.cells[3].firstChild.textContent
    product.product_image_url = rowElement.cells[4].firstChild.textContent

    return product

}
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
function clearProductForm() {
        var form = document.getElementById('createUpdateProductForm')

        form.querySelector('input[name="product_id"]').value = ''
        form.querySelector('input[name="product_id"]').disabled = false
        form.querySelector('input[name="product_name"]').value = ''
        form.querySelector('input[name="price"]').value = ''
        form.querySelector('input[name="product_description"]').value = ''
        form.querySelector('input[name="product_image_url"]').value = ''
    }

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
function productUpdate(){
    product = getProductFromForm()
    updateProductServer(product)

}
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

function filterProductTable(){
    filter_price = document.getElementById("filterPrice").value
   $.ajax({
       url: host + "/products/price/" + filter_price,
       method:'GET',
       datatype:'JSON',
       success:function(results){
            //var Table = document.getElementById("productTable");
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
function updateProductTableRow(product){
    rowElement = document.getElementById(product.product_id)
    rowElement.cells[1].firstChild.textContent = product.product_name
    rowElement.cells[2].firstChild.textContent = product.price
    rowElement.cells[3].firstChild.textContent = product.product_description
    rowElement.cells[4].firstChild.textContent = product.product_image_url
}
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
 function showProductDisplay() {
        document.getElementById('product-display').style.display = "block"
        document.getElementById('product-create-update').style.display = "none"
        document.getElementById('customer-display').style.display = "none"
        document.getElementById('customer-create-update').style.display = "none"
    }

function populateProductTable(){
    //ajax getAll
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

function customerCreate(){
console.log("in customerCreate")
customer= getCustomerFromForm()
console.log(customer)
$.ajax({
    url: host + "/customers",
    data:JSON.stringify(customer),
    method:"POST",
    dataType:"JSON",
    contentType: "application/json; charset=utf-8",
    success:function(result){
        console.log(result)
        populateCustomerTable()
        showCustomerDisplay()
        clearCustomerForm()

    },
    error:function(xhr,status,error){
        console.log("error"+error)
    }
})

}
function customerUpdate(){
customer = getCustomerFromForm()
updateCustomerServer(customer)

}
function updateCustomerServer(customer){
$.ajax({
    url: host + "/customers/"+customer.customer_id,
    data: JSON.stringify(customer),
    method: "PUT",
    dataType: "JSON",
    contentType: "application/json; charset=utf-8",
    success: function (result) {
        console.log(result)
        updateCustomerTableRow(customer)
        showCustomerDisplay()
        clearCustomerForm()

    },
    error: function (xhr, status, error) {
        console.log("error" + error)
    }
})
}

function filterCustomerTableCity(){
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
function filterCustomerTableCountry(){
    filter_country = document.getElementById("filterCountry").value
    console.log(filter_country)
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
function updateCustomerTableRow(customer){
rowElement = document.getElementById(customer.customer_id)
rowElement.cells[1].firstChild.textContent = customer.first_name
rowElement.cells[2].firstChild.textContent = customer.last_name
rowElement.cells[3].firstChild.textContent = customer.street_address
rowElement.cells[4].firstChild.textContent = customer.city
rowElement.cells[5].firstChild.textContent = customer.country
rowElement.cells[6].firstChild.textContent = customer.email
}

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
function showCustomerDisplay() {
    document.getElementById('customer-display').style.display = "block"
    document.getElementById('customer-create-update').style.display = "none"
    document.getElementById('product-display').style.display = "none"
    document.getElementById('product-create-update').style.display = "none"
    document.getElementById('showAllButton').style.display = "none"


}

function populateCustomerTable(){
//ajax getAll
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
if (window.location.href.indexOf("create-order") > -1) {
    cell8 = rowElem.insertCell(7)
    cell8.innerHTML = '<button onclick="selectCustomer(this, order)">Select Customer</button>'
    cell9 = rowElem.insertCell(8)
    cell9.innerHTML = '<button onclick="showCustomerUpdate(this)">Update Customer</button>'
    cell10 = rowElem.insertCell(9)
    cell10.innerHTML = '<button onclick="customerDelete(this)">Delete Customer</button>'

} else {
    cell8 = rowElem.insertCell(7)
    cell8.innerHTML = '<button onclick="showCustomerUpdate(this)">Update Customer</button>'
    cell9 = rowElem.insertCell(8)
    cell9.innerHTML = '<button onclick="customerDelete(this)">Delete Customer</button>'
}
 }

// Orders section




     // Login form
     function login(){
        username = document.getElementById("username").value;
        password = document.getElementById("password").value;
       $.ajax({
           url: host + '/users/' + username,
           method:'GET',
           datatype:'JSON',
           success:function(results){
                window.location.href = 'http://127.0.0.1:5000/login/' + results + '/' + password
           },
           error:function (xhr,status,error){
               console.log ("error "+error +" code:"+status)
           }

       })

    }