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

    db_password = user[4]

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
# ✅ View All Pets of a User
@app.route("/view_pets/<int:user_id>", methods=["GET"])
def view_pets(user_id):

    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM pets WHERE user_id = %s"

    cursor.execute(query, (user_id,))

    pets = cursor.fetchall()

    return {
        "pets": pets
    }
# ✅ UPDATE PET API
@app.route("/update_pet/<int:pet_id>", methods=["PUT"])
def update_pet(pet_id):
    data = request.get_json()

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
    UPDATE pets
    SET pet_name = %s,
        pet_type = %s,
        breed = %s,
        gender = %s,
        dob = %s,
        weight = %s,
        color = %s,
        photo = %s
    WHERE pet_id = %s
    """

    cursor.execute(query, (
        pet_name,
        pet_type,
        breed,
        gender,
        dob,
        weight,
        color,
        photo,
        pet_id
    ))

    db.commit()

    return {"message": "Pet updated successfully"}
# ✅ DELETE PET API
@app.route("/delete_pet/<int:pet_id>", methods=["DELETE"])
def delete_pet(pet_id):

    cursor = db.cursor()

    query = "DELETE FROM pets WHERE pet_id = %s"

    cursor.execute(query, (pet_id,))

    db.commit()

    return {"message": "Pet deleted successfully"}
# ✅ BOOK APPOINTMENT API
@app.route("/book_appointment", methods=["POST"])
def book_appointment():

    data = request.get_json()

    user_id = data["user_id"]
    pet_id = data["pet_id"]
    appointment_date = data["appointment_date"]
    appointment_time = data["appointment_time"]
    reason = data["reason"]

    cursor = db.cursor()

    query = """
    INSERT INTO appointments
    (user_id, pet_id, appointment_date, appointment_time, reason)
    VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(query, (
        user_id,
        pet_id,
        appointment_date,
        appointment_time,
        reason
    ))

    db.commit()

    return {"message": "Appointment Booked Successfully"}
# ✅ VIEW APPOINTMENTS API
@app.route("/view_appointments/<int:user_id>", methods=["GET"])
def view_appointments(user_id):

    cursor = db.cursor(dictionary=True)

    query = """
    SELECT * FROM appointments
    WHERE user_id = %s
    """

    cursor.execute(query, (user_id,))

    appointments = cursor.fetchall()

    # Convert date, time & created_at to string
    for appointment in appointments:
        appointment["appointment_date"] = str(appointment["appointment_date"])
        appointment["appointment_time"] = str(appointment["appointment_time"])
        appointment["created_at"] = str(appointment["created_at"])

    return {
        "appointments": appointments
    }
# ✅ ADD PRODUCT API
@app.route("/add_product", methods=["POST"])
def add_product():

    data = request.get_json()

    product_name = data["product_name"]
    category = data["category"]
    price = data["price"]
    stock = data["stock"]
    description = data["description"]
    image = data["image"]

    cursor = db.cursor()

    query = """
    INSERT INTO products
    (product_name, category, price, stock, description, image)
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.execute((
        query
    ), (
        product_name,
        category,
        price,
        stock,
        description,
        image
    ))

    db.commit()

    return {"message": "Product Added Successfully"}
# ✅ VIEW PRODUCTS API
@app.route("/view_products", methods=["GET"])
def view_products():

    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM products"

    cursor.execute(query)

    products = cursor.fetchall()

    # Convert created_at to string
    for product in products:
        product["created_at"] = str(product["created_at"])

    return {
        "products": products
    }

# ✅ CANCEL APPOINTMENT API
@app.route("/cancel_appointment/<int:appointment_id>", methods=["DELETE"])
def cancel_appointment(appointment_id):

    cursor = db.cursor()

    query = "DELETE FROM appointments WHERE appointment_id = %s"

    cursor.execute(query, (appointment_id,))

    db.commit()

    return {"message": "Appointment Cancelled Successfully"}
# ✅ PLACE ORDER API
@app.route("/place_order", methods=["POST"])
def place_order():

    data = request.get_json()

    user_id = data["user_id"]
    product_id = data["product_id"]
    quantity = data["quantity"]
    total_price = data["total_price"]

    cursor = db.cursor()

    query = """
    INSERT INTO orders
    (user_id, product_id, quantity, total_price)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (
        user_id,
        product_id,
        quantity,
        total_price
    ))

    db.commit()

    return {"message": "Order Placed Successfully"}
# ✅ DASHBOARD API
@app.route("/dashboard/<int:user_id>", methods=["GET"])
def dashboard(user_id):

    cursor = db.cursor(dictionary=True)

    # User Details
    cursor.execute(
        "SELECT user_id, full_name, email, phone FROM users WHERE user_id=%s",
        (user_id,)
    )

    user = cursor.fetchone()

    if user is None:
        return {"message": "User not found"}, 404


    # Total Pets
    cursor.execute(
        "SELECT COUNT(*) AS total_pets FROM pets WHERE user_id=%s",
        (user_id,)
    )

    total_pets = cursor.fetchone()


    # Total Appointments
    cursor.execute(
        "SELECT COUNT(*) AS total_appointments FROM appointments WHERE user_id=%s",
        (user_id,)
    )

    total_appointments = cursor.fetchone()


    return {
        "user": user,
        "total_pets": total_pets["total_pets"],
        "total_appointments": total_appointments["total_appointments"]
    }
    

if __name__ == "__main__":
    app.run(debug=True)
    