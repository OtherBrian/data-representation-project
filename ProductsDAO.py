import mysql.connector
import dbconfig as cfg

class ProductsDAO:

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

    def allProducts(self):
        self.connect()
        cursor = self.db.cursor()
        sql = 'SELECT * FROM products'
        cursor.execute(sql)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)
        cursor.close()
        self.db.close()
        return returnArray

    def findProductById(self, product_id):
        self.connect()
        cursor = self.db.cursor()
        sql = 'SELECT * FROM products WHERE product_id = %s'
        values = [ product_id ]
        cursor.execute(sql, values)
        result = cursor.fetchone()
        cursor.close()
        self.db.close()
        return self.convertToDict(result)

    def findProductsByPrice(self, price):
        self.connect()
        cursor = self.db.cursor()
        sql = 'SELECT * FROM products WHERE price <= %s'
        values = [ price ]
        cursor.execute(sql, values)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)
        cursor.close()
        self.db.close()
        return returnArray

    def create(self, product):
        self.connect()
        cursor = self.db.cursor()
        sql = "INSERT INTO products (product_name, price, product_description, product_image_url) VALUES (%s,%s,%s,%s)"
        values = [
        product['product_name'],
        product['price'],
        product['product_description'],
        product['product_image_url']
        ]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        self.db.close()
        return cursor.lastrowid

    def updateProduct(self, product):
        self.connect()
        cursor = self.db.cursor()
        sql = "UPDATE products SET product_name = %s, price = %s, product_description = %s, product_image_url = %s where product_id = %s"
        values = [
        product['product_name'],
        product['price'],
        product['product_description'],
        product['product_image_url'],
        product['product_id']
        ]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        self.db.close()
        return product

    def delete(self, product_id):
        self.connect()
        cursor = self.db.cursor()
        sql = 'DELETE FROM products WHERE product_id = %s'
        values = [product_id]
        cursor.execute(sql, values)
        self.db.commit()
        cursor.close()
        self.db.close()
        return {}

    def convertToDict(self, result):
        colnames = ['product_id','product_name', 'price', 'product_description', 'product_image_url']
        product = {}

        if result:
            for i , colName in enumerate(colnames):
                value = result[i]
                product[colName] = value
        return product

productsDAO = ProductsDAO()