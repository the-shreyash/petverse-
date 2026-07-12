import mysql.connector

# Attempt to connect to mysql server
passwords = ["", "shalini@2005#"]
db = None

for pwd in passwords:
    try:
        # First connect without database name to ensure we can create it if missing
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password=pwd
        )
        cursor = db.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS petverse")
        db.commit()
        cursor.close()
        
        # Connect to the target database
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password=pwd,
            database="petverse"
        )
        break
    except mysql.connector.Error as err:
        db = None
        continue

if db is None:
    raise Exception("Failed to connect to MySQL database.")

cursor = db.cursor()

# 1. users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL
)
""")

# 2. pets table
cursor.execute("""
CREATE TABLE IF NOT EXISTS pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pet_name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(100),
    breed VARCHAR(100),
    gender VARCHAR(50),
    dob DATE,
    weight VARCHAR(50),
    color VARCHAR(100),
    photo TEXT
)
""")

# 3. appointments table
cursor.execute("""
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pet_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 4. products table
cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 5. orders table
cursor.execute("""
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 6. adoption table
cursor.execute("""
CREATE TABLE IF NOT EXISTS adoption (
    adoption_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pet_name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(100),
    breed VARCHAR(100),
    age VARCHAR(50),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 7. cart table
cursor.execute("""
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL
)
""")

# 8. feedback table
cursor.execute("""
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

db.commit()
cursor.close()

print("Database Connected Successfully!")