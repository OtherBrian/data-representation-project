import mysql.connector
import dbconfig as cfg

class UsersDAO:

    db = ""
    def __init__(self):
        self.db = mysql.connector.connect(
        host=cfg.mysql['host'],
        user=cfg.mysql['user'],
        password=cfg.mysql['password'],
        database=cfg.mysql['database']
        )

    def allUsers(self):
        cursor = self.db.cursor()
        sql = 'SELECT * FROM users'
        cursor.execute(sql)
        results = cursor.fetchall()
        returnDict = {}
        for idx, result in enumerate(results):
            resultAsDict = self.convertToDict(result)
            returnDict[idx] = resultAsDict
        cursor.close()
        return returnDict

# Just returning the user ID that matches a particular username
    def getUserByUsername(self, username):
        cursor = self.db.cursor()
        sql = 'SELECT user_id FROM users WHERE name = %s'
        values = [ username ]
        cursor.execute(sql, values)
        results = cursor.fetchone()
        cursor.close()
        return results


    def convertToDict(self, result):
        colnames = ['user_id','name', 'email', 'password']
        user = {}

        if result:
            for i , colName in enumerate(colnames):
                value = result[i]
                user[colName] = value
        return user
    
usersDAO = UsersDAO()