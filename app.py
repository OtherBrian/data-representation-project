from flask import Flask, request, abort, jsonify, render_template, redirect, url_for
from flask_login import (
    LoginManager,
    UserMixin,
    current_user,
    login_required,
    login_user,
    logout_user
)
from CustomersDAO import customersDAO
from ProductsDAO import productsDAO
from UsersDAO import usersDAO
import requests
import code
from os import getenv
from typing import Dict

app = Flask(__name__, static_url_path='', static_folder='staticpages', template_folder='staticpages')
app.config["SECRET_KEY"] = getenv("SECRET_KEY", default="secret_key_example")
login_manager = LoginManager(app)


@app.route('/')
def index():
    username = "anonymous"
    if current_user.is_authenticated:  # type: ignore
        username = current_user.username  # type: ignore
    return f"""
        <h1>Hi {username}</h1>
        <h3>Welcome to the store!</h3>
    """

# Customers first
@app.route('/viewcustomers')
@login_required
def customers():
    return render_template('customers.html')

#get all customers
@app.route('/customers')
@login_required
def getAllCustomers():
    return jsonify(customersDAO.allCustomers())


# find customers By id
@app.route('/customers/<int:id>')
@login_required
def findCustomersByID(id):
    return jsonify(customersDAO.findCustomerById(id))

# find customers by city
@app.route('/customers/city/<string:city>')
@login_required
def findCustomersByCity(city):
    return jsonify(customersDAO.findCustomersByCity(city))

# find customers by country
@app.route('/customers/country/<string:country>')
@login_required
def findCustomersByCountry(country):
    return jsonify(customersDAO.findCustomersByCountry(country))

# Create customer
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


# Update customer
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
@app.route('/products/price/<int:price>')
def findProductsByPrice(price):
    return jsonify(productsDAO.findProductsByPrice(price))


# Create product
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


# Update product
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

# Delete product
@app.route('/products/<int:id>', methods=['DELETE'])
@login_required
def deleteProduct(id):
    productsDAO.delete(id)

    return jsonify({"done": True})


# Orders
# Create Order on Shopify
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
    headers = {'Content-type': 'application/json', 'X-Shopify-Access-Token': code.code}
    response = requests.post(url, json=order, headers=headers)
    new_order = response.json()
    new_order_id = new_order["draft_order"]["id"]

    return jsonify(new_order_id)

# Get Shopify orders
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

# Delete Shopify order
@app.route('/orders/<int:id>', methods=['DELETE'])
@login_required
def deleteOrder(id):
    url = 'https://brians-flask-store.myshopify.com/admin/api/2021-10/draft_orders/' + str(id) + '.json'
    headers = {'X-Shopify-Access-Token': code.code}
    response = requests.delete(url, headers=headers)

    return jsonify({"done": True})

## Sorting login and authorization
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

users: Dict[str, "User"] = {}
all_users = usersDAO.allUsers()

for key in range(len(all_users)):
    users[key+1] = User(
        id=all_users[key]["user_id"],
        username=all_users[key]["name"],
        email=all_users[key]["email"],
        password=all_users[key]["password"],
        )

@login_manager.user_loader
def load_user(user_id):
    return User.get(int(user_id))

@app.route("/login/<int:id>/<string:password>")
def login(id, password):
    user = load_user(id)
    print(user)
    if user and user.password == password:
        login_user(user, remember=True)
        print("Logged in!")
        print(current_user.is_authenticated)
        return redirect(url_for('index'))
    return "<h1>Invalid user id or password</h1>"

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


@app.route("/settings")
@login_required
def settings():
    return "<h1>Route protected</h1>"

if __name__ == "__main__":
    app.run(debug=True)
