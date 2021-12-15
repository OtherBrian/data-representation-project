from flask import Flask, request, abort, jsonify, render_template, redirect, url_for
from flask_login import LoginManager, UserMixin, current_user, login_required, login_user, logout_user

import requests
from os import getenv
from typing import Dict

# Import the 3 Data Access Object Python files in this folder.
from CustomersDAO import customersDAO
from ProductsDAO import productsDAO
from UsersDAO import usersDAO

# code holds the secret API key for the Shopify store. 
# This is in my gitignore as it sent off many alarms when I made the first one public!
import code

# Instantiate the app and login_manager.
app = Flask(__name__, static_url_path='', static_folder='staticpages', template_folder='staticpages')
app.config["SECRET_KEY"] = getenv("SECRET_KEY", default="secret_key_example")
login_manager = LoginManager(app)


##### USER LOGIN #####
# This was adapted from https://github.com/leynier/flask-login-without-orm/blob/main/flask_login_without_orm/main.py
# Note - this is not a secure way to do this! It's just here for the example implementation!

# Create the User class
class User(UserMixin):
    def __init__(self, id: str, username: str, email: str, password: str):
        self.id = id
        self.username = username
        self.email = email
        self.password = password

    @staticmethod
    def get(id):
        return users.get(id)

    def __str__(self):
        return f"<Id: {self.id}, Username: {self.username}, Email: {self.email}, Password: {self.password}>"

    def __repr__(self):
        return self.__str__()

# Create a dictionary to store the all the users in the database.
users: Dict[str, "User"] = {}
all_users = usersDAO.allUsers()

for key in range(len(all_users)):
    users[key+1] = User(
        id=all_users[key]["user_id"],
        username=all_users[key]["name"],
        email=all_users[key]["email"],
        password=all_users[key]["password"],
        )

# user_load will go through and find the User with the matching user_id
@login_manager.user_loader
def load_user(id):
    return User.get(int(id))

# Login page
@app.route("/login")
def login_page():
    return render_template("login.html")

# Uses ID and password to check if they match with what is in the database.
# In reality, I should be using password hashing here. Ran out of time!
@app.route("/login/<int:id>/<string:password>")
def login(id, password):
    user = load_user(id)
    
    if user and user.password == password:
        login_user(user, remember=True)
        print("Logged in!")
        print(current_user.is_authenticated)
        return redirect(url_for("index_authed"))

    return ""

# Login page requests username, but need ID to perform the login.
# This does a GET request and returns the ID that matches that username. Again, not secure.
@app.route("/users/<string:username>", methods=['GET'])
def findUserByUsername(username):
    return jsonify(usersDAO.getUserByUsername(username))

# Log the user out, return to index.
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))

#####END OF USER LOGIN#####

# Home page for unauthorized users
@app.route('/')
def index():
    return render_template('index.html')

# Home page for authorized users
@app.route('/home')
@login_required
def index_authed():
    return render_template('index-authed.html')

#####CUSTOMERS#####

# Customers page - authorization only
@app.route('/viewcustomers')
@login_required
def customers():
    return render_template('customers.html')

# Gets all customers from database
@app.route('/customers')
@login_required
def getAllCustomers():
    return jsonify(customersDAO.allCustomers())

# Gets specific customers by id from database
@app.route('/customers/<int:id>')
@login_required
def findCustomersByID(id):
    return jsonify(customersDAO.findCustomerById(id))

# Gets specific customers by city from database
@app.route('/customers/city/<string:city>')
@login_required
def findCustomersByCity(city):
    return jsonify(customersDAO.findCustomersByCity(city))

# Gets specific customers by country from database.
@app.route('/customers/country/<string:country>')
@login_required
def findCustomersByCountry(country):
    return jsonify(customersDAO.findCustomersByCountry(country))

# Create new customer customer
@app.route('/customers', methods=['POST'])
@login_required
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


# Update existing customer
@app.route('/customers/<int:id>', methods=['PUT'])
@login_required
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
@login_required
def deleteCustomer(id):
    customersDAO.delete(id)

    return jsonify({"done": True})

#####END OF CUSTOMERS#####

#####PRODUCTS#####

# Products page - available to all
@app.route('/viewproducts')
def products():
    return render_template('products.html')

# Gets all products from database
@app.route('/products')
def getAllProducts():
    return jsonify(productsDAO.allProducts())


# Gets specific product by id from database
@app.route('/products/<int:id>')
def findProductsById(id):
    return jsonify(productsDAO.findProductById(id))

# Gets specific products below the defined price from database.
@app.route('/products/price/<int:price>')
def findProductsByPrice(price):
    return jsonify(productsDAO.findProductsByPrice(price))

# Create a new product - authorized users only.
@app.route('/products', methods=['POST'])
@login_required
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


# Update existing product - authorized users only.
@app.route('/products/<int:id>', methods=['PUT'])
@login_required
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

# Delete product - authorized users only.
@app.route('/products/<int:id>', methods=['DELETE'])
@login_required
def deleteProduct(id):
    productsDAO.delete(id)

    return jsonify({"done": True})

#####END OF PRODUCTS#####

#####ORDERS#####

# Orders page - authorized users only
@app.route('/vieworders')
@login_required
def orders():
    return render_template('orders.html')

# Create orders page - authorized users only.
@app.route('/create-order')
@login_required
def createOrdersPage():
    return render_template('create-order.html')

# Create a Draft Order on Shopify
@app.route('/orders', methods=['POST'])
@login_required
def createOrder():

    if not request.json:
        abort(400)

    order = {
        'draft_order': {
            'status': 'completed',
            'line_items' : [{
            'name': request.json["product_name"],
            'title':  request.json["product_name"],
            'price': request.json["price"],
            'taxable': 'false',
            'quantity': 1
            }],
            'email': request.json["customer_email"],
            'shipping_address': {
                'first_name': request.json["customer_first_name"],
                'last_name': request.json["customer_last_name"],
                'address1': request.json["customer_street_address"],
                'city': request.json["customer_city"],
                'country': request.json["customer_country"]
            },
            'total_price': request.json["price"],
            'send_receipt': 'false'
        }
    }
    url = 'https://brians-flask-store.myshopify.com/admin/api/2021-10/draft_orders.json'
    # code.code is the secret API key. This will not work unless you have it.
    # You can setup your own Shopify store and generate an API key via these steps - https://shopify.dev/apps/auth/basic-http
    headers = {'Content-type': 'application/json', 'X-Shopify-Access-Token': code.code}
    response = requests.post(url, json=order, headers=headers)
    new_order = response.json()
    new_order_id = new_order["draft_order"]["id"]

    return jsonify(new_order_id)

# Get draft orders from the Shopify store
@app.route('/orders', methods=['GET'])
@login_required
def getOrders():
    url = 'https://brians-flask-store.myshopify.com/admin/api/2021-10/draft_orders.json'
    headers = {'X-Shopify-Access-Token': code.code}
    response = requests.get(url, headers=headers)
    data = response.json()
    data = data["draft_orders"]
    listOfOrders = []
    for order in data:
        order_details = {
            'order_id': order["id"],
            'name': order["shipping_address"]["name"],
            'email': order["email"],
            'street_address': order["shipping_address"]["address1"],
            'city': order["shipping_address"]["city"],
            'country': order["shipping_address"]["country"],
            'product': order["line_items"][0]["title"],
            'cost': order["total_price"]
        }
        listOfOrders.append(order_details)

    return jsonify(listOfOrders)

# Delete the draft order from the Shopify store.
@app.route('/orders/<int:id>', methods=['DELETE'])
@login_required
def deleteOrder(id):
    url = 'https://brians-flask-store.myshopify.com/admin/api/2021-10/draft_orders/' + str(id) + '.json'
    headers = {'X-Shopify-Access-Token': code.code}
    response = requests.delete(url, headers=headers)

    return jsonify({"done": True})

if __name__ == "__main__":
    app.run(debug=True)