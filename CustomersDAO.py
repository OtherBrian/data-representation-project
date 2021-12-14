import mysql.connector
import dbconfig as cfg

class CustomersDAO:

    db = ""

    def __init__(self):
        self.host=cfg.mysql['host']
        self.user=cfg.mysql['user']
        self.password=cfg.mysql['password']
        self.database=cfg.mysql['database']


    def connect(self):
        self.db = mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
            )

    def allCustomers(self):
        self.connect()
        cursor = self.db.cursor()
        sql = 'select * from customers'
        cursor.execute(sql)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)
        cursor.close()
        self.db.close()
        return returnArray

    def findCustomerById(self, customer_id):
        self.connect()
        cursor = self.db.cursor()
        sql = 'SELECT * FROM customers WHERE customer_id = %s'
        values = [ customer_id ]
        cursor.execute(sql, values)
        result = cursor.fetchone()
        cursor.close()
        self.db.close()
        return self.convertToDict(result)

    def findCustomersByCity(self, city):
        self.connect()
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
        self.db.close()
        return returnArray

    def findCustomersByCountry(self, country):
        self.connect()
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
        self.db.close()
        return returnArray

    def create(self, customer):
        self.connect()
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
        self.db.close()
        return cursor.lastrowid

    def updateCustomer(self, customer):
        self.connect()
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
        self.db.close()
        return customer

    def delete(self, customer_id):
        self.connect()
        cursor = self.db.cursor()
        sql = 'DELETE FROM customers WHERE customer_id = %s'
        values = [customer_id]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        self.db.close()
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