from flask import Flask, url_for, request, redirect, abort, jsonify
from CustomersDAO import customersDAO
from ProductsDAO import productsDAO

app = Flask(__name__, static_url_path='', static_folder='staticpages')

@app.route('/')
def index():
    return "test test"

# Customers first
#get all
@app.route('/customers')
def getAllCustomers():
    return jsonify(customersDAO.allCustomers())


# find customers By id
@app.route('/customers/<int:id>')
def findCustomersByID(id):
    return jsonify(customersDAO.findCustomerById(id))

# find custoemrs by city
@app.route('/customers/<string:city>')
def findCustomersByCity(city):
    return jsonify(customersDAO.findCustomersByCity(city))

# find custoemrs by country
@app.route('/customers/<string:country>')
def findCustomersByCountry(country):
    return jsonify(customersDAO.findCustomersByCity(country))

# Create customer
@app.route('/customers', methods=['POST'])
def createCustomer():
   
    if not request.json:
        abort(400)

    customer = {
        "first_name": request.json["first_name"],
        "last_name": request.json["last_name"],
        "street_address": request.json["street_address"],
        "city": request.json["city"],
        "country": request.json["country"],
        "email": request.json["email"]
    }
    return jsonify(customersDAO.create(customer))


# Update customer
@app.route('/customers/<int:id>', methods=['PUT'])
def updateCustomer(id):
    foundCustomer=customersDAO.findCustomerById(id)
    print (foundCustomer)
    if foundCustomer == {}:
        return jsonify({}), 404
    currentCustomer = foundCustomer
    if 'first_name' in request.json:
        currentCustomer['first_name'] = request.json['first_name']
    if 'last_name' in request.json:
        currentCustomer['last_name'] = request.json['last_name']
    if 'street_address' in request.json:
        currentCustomer['street_address'] = request.json['street_address']
    if 'city' in request.json:
        currentCustomer['city'] = request.json['city']
    if 'country' in request.json:
        currentCustomer['country'] = request.json['country']
    if 'email' in request.json:
        currentCustomer['email'] = request.json['email']
    customersDAO.updateCustomer(currentCustomer)

    return jsonify(currentCustomer)

# Delete customer
@app.route('/customers/<int:id>', methods=['DELETE'])
def deleteCustomer(id):
    customersDAO.delete(id)

    return jsonify({"done": True})


# Products
# get all products
@app.route('/products')
def getAllProducts():
    return jsonify(productsDAO.allProducts())


# find products By id
@app.route('/products/<int:id>')
def findProductsById(id):
    return jsonify(productsDAO.findProductById(id))

# find products by price
@app.route('/products/<float:price>')
def findProductsByPrice(price):
    return jsonify(productsDAO.findProductsByPrice(price))


# Create product
@app.route('/products', methods=['POST'])
def createProduct():
   
    if not request.json:
        abort(400)

    product = {
        "product_name": request.json["product_name"],
        "price": request.json["price"],
        "product_description": request.json["product_description"],
        "product_image_url": request.json["product_image_url"]
    }
    return jsonify(productsDAO.create(product))

    return "served by Create "

# Update customer
@app.route('/products/<int:id>', methods=['PUT'])
def updateProduct(id):
    foundProduct=productsDAO.findProductById(id)
    print (foundProduct)
    if foundProduct == {}:
        return jsonify({}), 404
    currentProduct = foundProduct
    if 'product_name' in request.json:
        currentProduct['product_name'] = request.json['product_name']
    if 'price' in request.json:
        currentProduct['price'] = request.json['price']
    if 'product_description' in request.json:
        currentProduct['product_description'] = request.json['product_description']
    if 'product_image_url' in request.json:
        currentProduct['product_image_url'] = request.json['product_image_url']
    productsDAO.updateProduct(currentProduct)

    return jsonify(currentProduct)

# Delete customer
@app.route('/products/<int:id>', methods=['DELETE'])
def deleteProduct(id):
    productsDAO.delete(id)

    return jsonify({"done": True})

if __name__ == "__main__":
    app.run(debug=True)
