import mysql.connector
import dbconfig as cfg

class CustomersDAO:

    db = ""

    def __init__(self):
        self.db = mysql.connector.connect(
        host=cfg.mysql['host'],
        user=cfg.mysql['user'],
        password=cfg.mysql['password'],
        database=cfg.mysql['database']
        )

    def allCustomers(self):
        cursor = self.db.cursor()
        sql = 'select * from customers'
        cursor.execute(sql)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)
        cursor.close()
        return returnArray

    def findCustomerById(self, customer_id):
        cursor = self.db.cursor()
        sql = 'SELECT * FROM customers WHERE customer_id = %s'
        values = [ customer_id ]
        cursor.execute(sql, values)
        result = cursor.fetchone()
        cursor.close()
        return self.convertToDict(result)

    def findCustomersByCity(self, city):
        cursor = self.db.cursor()
        sql = 'SELECT * FROM customers WHERE city = %s'
        values = [ city ]
        cursor.execute(sql, values)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)
        cursor.close()
        return returnArray

    def findCustomersByCountry(self, country):
        cursor = self.db.cursor()
        sql = 'SELECT * FROM customers WHERE country = %s'
        values = [ country ]
        cursor.execute(sql, values)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)
        cursor.close()
        return returnArray

    def create(self, customer):
        cursor = self.db.cursor()
        sql = "INSERT INTO customers (first_name, last_name, street_address, city, country, email) VALUES (%s,%s,%s,%s,%s,%s)"
        values = [
        customer['first_name'],
        customer['last_name'],
        customer['street_address'],
        customer['city'],
        customer['country'],
        customer['email']
        ]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        return cursor.lastrowid

    def updateCustomer(self, customer):
        cursor = self.db.cursor()
        sql = "UPDATE customers SET first_name = %s, last_name = %s, street_address = %s, city = %s, country = %s, email = %s WHERE customer_id = %s"
        values = [
        customer['first_name'],
        customer['last_name'],
        customer['street_address'],
        customer['city'],
        customer['country'],
        customer['email'],
        customer['customer_id']

        ]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        return customer

    def delete(self, customer_id):
        cursor = self.db.cursor()
        sql = 'DELETE FROM customers WHERE customer_id = %s'
        values = [customer_id]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        return {}

    def convertToDict(self, result):
        colnames = ['customer_id','first_name', 'last_name', 'street_address', 'city', 'country', 'email']
        customer = {}

        if result:
            for i , colName in enumerate(colnames):
                value = result[i]
                customer[colName] = value
        return customer

customersDAO = CustomersDAO()