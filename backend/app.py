from flask import Flask, request
from config import db

app = Flask(__name__)

@app.route("/")
def home():
    return "PetVerse Backend Running Successfully!"

# ✅ SIGNUP API
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

    return {"message": "User Registered Successfully"}

# ✅ LOGIN API (correct place)
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data["email"]
    password = data["password"]

    cursor = db.cursor()

    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    if user is None:
        return {"message": "User not found"}, 404

    db_password = user[3]

    if password == db_password:
        return {"message": "Login successful", "user_id": user[0]}
    else:
        return {"message": "Wrong password"}, 401
    
# ✅ add_pet API (OUTSIDE login)
@app.route("/add_pet", methods=["POST"])
def add_pet():
    data = request.get_json()

    user_id = data["user_id"]
    pet_name = data["pet_name"]
    pet_type = data["pet_type"]
    breed = data["breed"]
    gender = data["gender"]
    dob = data["dob"]
    weight = data["weight"]
    color = data["color"]
    photo = data["photo"]

    cursor = db.cursor()

    query = """
    INSERT INTO pets 
    (user_id, pet_name, pet_type, breed, gender, dob, weight, color, photo)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    cursor.execute(query, (user_id, pet_name, pet_type, breed, gender, dob, weight, color, photo))
    db.commit()

    return {"message": "Pet added successfully"}


if __name__ == "__main__":
    app.run(debug=True)