import mysql.connector
from werkzeug.local import LocalProxy
from flask import g

passwords = ["", "shalini@2005#"]
ACTIVE_PWD = ""

# Initialization
for pwd in passwords:
    try:
        conn = mysql.connector.connect(host="localhost", user="root", password=pwd)
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS petverse")
        conn.commit()
        cursor.close()
        conn.close()
        
        init_conn = mysql.connector.connect(host="localhost", user="root", password=pwd, database="petverse")
        ACTIVE_PWD = pwd
        break
    except:
        continue

if not ACTIVE_PWD and 'init_conn' not in locals():
    # If empty password worked, ACTIVE_PWD is "" but init_conn is defined.
    # We must check if init_conn was successfully created.
    pass

cursor = init_conn.cursor()

# 1. users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    is_verified BOOLEAN DEFAULT 0,
    role VARCHAR(50) DEFAULT 'user',
    provider VARCHAR(50) DEFAULT 'local',
    timezone VARCHAR(50),
    language VARCHAR(10),
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
""")

# 2. pets table
cursor.execute("""
CREATE TABLE IF NOT EXISTS pets (
    id VARCHAR(36) PRIMARY KEY,
    owner_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100),
    breed VARCHAR(100),
    gender VARCHAR(50),
    birth_date DATE,
    weight DECIMAL(6,2),
    height DECIMAL(6,2),
    color VARCHAR(100),
    microchip_number VARCHAR(50),
    sterilized BOOLEAN DEFAULT 0,
    blood_group VARCHAR(20),
    profile_image TEXT,
    cover_image TEXT,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Healthy',
    is_active BOOLEAN DEFAULT 1,
    is_deleted BOOLEAN DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
""")

# 3. appointments table
cursor.execute("""
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    pet_id VARCHAR(36) NOT NULL,
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
    user_id VARCHAR(36) NOT NULL,
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
    user_id VARCHAR(36) NOT NULL,
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
    user_id VARCHAR(36) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL
)
""")

# 8. feedback table
cursor.execute("""
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 9. health_records table
cursor.execute("""
CREATE TABLE IF NOT EXISTS health_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id VARCHAR(36) NOT NULL,
    record_type VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 10. vaccinations table
cursor.execute("""
CREATE TABLE IF NOT EXISTS vaccinations (
    vaccination_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id VARCHAR(36) NOT NULL,
    vaccine_name VARCHAR(255) NOT NULL,
    date_administered DATE NOT NULL,
    next_due DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 11. wishlist table
cursor.execute("""
CREATE TABLE IF NOT EXISTS wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 12. community_posts table
cursor.execute("""
CREATE TABLE IF NOT EXISTS community_posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 13. notifications table
cursor.execute("""
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# 14. ai_conversations table
cursor.execute("""
CREATE TABLE IF NOT EXISTS ai_conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    messages_json LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
""")

init_conn.commit()
cursor.close()
init_conn.close()

def get_db():
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host="localhost",
            user="root",
            password=ACTIVE_PWD,
            database="petverse"
        )
    return g.db

db = LocalProxy(get_db)
print("Database Configured Successfully (LocalProxy)")