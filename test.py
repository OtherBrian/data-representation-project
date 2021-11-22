from CustomersDAO import customersDAO
from ProductsDAO import productsDAO

customer1 = {
    'customer_id': 20,
    'first_name': 'dave',
    'last_name': 'ok',
    'street_address': 'some fantasy road',
    'city': 'Galway',
    'country': 'France',
    'email': 'meh@gmail.com'
}

customer2 = {
    'customer_id': 20,
    'first_name': 'mike',
    'last_name': 'hello',
    'street_address': 'some other road',
    'city': 'Besiktas',
    'country': 'Mars',
    'email': 'lolol@gmail.com'
}

#returnValue = customerDAO.create(customer1)
returnValue = productsDAO.findProductsByPrice(30)
print(returnValue)
#returnValue = customerDAO.findCustomerById(customer1['customer_id'])
#print("find By Id")
#print(returnValue)
#returnValue = customerDAO.updateCustomer(customer2)
#print(returnValue)
#print(returnValue)
#returnValue = customerDAO.findById(book2['ISBN'])
#returnValue = customerDAO.delete(customer2['customer_id'])
#print(returnValue)
#returnValue = customerDAO.findCustomersByCountry('United Kingdom')
#print(returnValue)
#print(returnValue)