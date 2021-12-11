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
        sql = 'select * from users'
        cursor.execute(sql)
        results = cursor.fetchall()
        returnDict = {}
        for idx, result in enumerate(results):
            resultAsDict = self.convertToDict(result)
            returnDict[idx] = resultAsDict

        return returnDict

    def convertToDict(self, result):
        colnames = ['user_id','name', 'email', 'password']
        user = {}

        if result:
            for i , colName in enumerate(colnames):
                value = result[i]
                user[colName] = value
        return user
    
usersDAO = UsersDAO()