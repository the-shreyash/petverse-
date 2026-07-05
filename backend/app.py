from flask import Flask, request
from config import db

app = Flask(__name__)

@app.route("/")
def home():
    return "PetVerse Backend Running Successfully!"

@app.route("/signup", methods=["POST"])
def signup():
    cursor = db.cursor()
   
    data = request.get_json()

    full_name = data["full_name"]
    email = data["email"]
    phone = data["phone"]
    password = data["password"]
    query = """
    INSERT INTO users (full_name, email, phone, password)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (full_name, email, phone, password))
    db.commit()

    return "User Registered Successfully!" 

if __name__ == "__main__":
    app.run(debug=True)