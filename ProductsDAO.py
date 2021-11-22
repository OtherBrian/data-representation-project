import mysql.connector
import dbconfig as cfg

class ProductsDAO:

    db = ""

    def __init__(self):
        self.db = mysql.connector.connect(
        host=cfg.mysql['host'],
        user=cfg.mysql['user'],
        password=cfg.mysql['password'],
        database=cfg.mysql['database']
        )

    def allProducts(self):
        cursor = self.db.cursor()
        sql = 'select * from products'
        cursor.execute(sql)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)

        return returnArray

    def findProductById(self, product_id):
        cursor = self.db.cursor()
        sql = 'select * from products where product_id = %s'
        values = [ product_id ]
        cursor.execute(sql, values)
        result = cursor.fetchone()
        return self.convertToDict(result)

    def findProductsByPrice(self, price):
        cursor = self.db.cursor()
        sql = 'select * from products where price <= %s'
        values = [ price ]
        cursor.execute(sql, values)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            resultAsDict = self.convertToDict(result)
            returnArray.append(resultAsDict)

        return returnArray

    def create(self, product):
        cursor = self.db.cursor()
        sql = "insert into products (product_id, product_name, price, product_description) values (%s,%s,%s,%s)"
        values = [
        product['product_id'],
        product['product_name'],
        product['price'],
        product['product_description']
        ]
        cursor.execute(sql, values)
        self.db.commit()
        return cursor.lastrowid

    def updateProduct(self, product):
        cursor = self.db.cursor()
        sql = "update products set product_name = %s, price = %s, product_description = %s where product_id = %s"
        values = [
        product['product_name'],
        product['price'],
        product['product_description'],
        product['product_id']
        ]
        cursor.execute(sql, values)
        self.db.commit()
        return product

    def delete(self, product_id):
        cursor = self.db.cursor()
        sql = 'delete from products where product_id = %s'
        values = [product_id]
        cursor.execute(sql, values)
        self.db.commit()
        return {}

    def convertToDict(self, result):
        colnames = ['product_id','product_name', 'price', 'product_description']
        product = {}

        if result:
            for i , colName in enumerate(colnames):
                value = result[i]
                product[colName] = value
        return product

productsDAO = ProductsDAO()