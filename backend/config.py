import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="shalini@2005#",
    database="petverse"
)

print("Database Connected Successfully!")