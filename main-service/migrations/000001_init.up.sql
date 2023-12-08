-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'user',
    position VARCHAR(255) NOT NULL DEFAULT '',
    department VARCHAR(255) NOT NULL DEFAULT '',
    profile_image VARCHAR(255) NOT NULL DEFAULT '',
    is_exist BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verify_token VARCHAR(255) NOT NULL DEFAULT '',
    verify_token_expires TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the inventory_products table
CREATE TABLE IF NOT EXISTS inventory_products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE DEFAULT '',
    name VARCHAR(255) NOT NULL DEFAULT '',
    brand VARCHAR(255) NOT NULL DEFAULT '',
    standard_unit VARCHAR(255) NOT NULL DEFAULT '',
    thumbnail VARCHAR(255) NOT NULL DEFAULT '',
    supplier VARCHAR(255) NOT NULL DEFAULT '',
    remarks VARCHAR(255) NOT NULL DEFAULT '',
    is_exist BOOLEAN NOT NULL DEFAULT true,
    created_by VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) NOT NULL DEFAULT '',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the inventory_incoming table
CREATE TABLE IF NOT EXISTS inventory_incomings (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES inventory_products(id) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT '',
    quantity NUMERIC NOT NULL DEFAULT 0,
    length NUMERIC NOT NULL DEFAULT 0,
    width NUMERIC NOT NULL DEFAULT 0,
    height NUMERIC NOT NULL DEFAULT 0,
    unit VARCHAR(255) NOT NULL DEFAULT '',
    standard_quantity NUMERIC NOT NULL DEFAULT 0,
    ref_no VARCHAR(255) NOT NULL DEFAULT '',
    ref_doc VARCHAR(255) NOT NULL DEFAULT '',
    cost NUMERIC NOT NULL DEFAULT 0,
    store_location VARCHAR(255) NOT NULL DEFAULT '',
    store_country VARCHAR(255) NOT NULL DEFAULT '',
    remarks VARCHAR(255) NOT NULL DEFAULT '',
    created_by VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) NOT NULL DEFAULT '',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the inventory_outgoing table
CREATE TABLE IF NOT EXISTS inventory_outgoings (
    id SERIAL PRIMARY KEY,
    incoming_id INTEGER REFERENCES inventory_incomings(id) NOT NULL,
    product_id INTEGER REFERENCES inventory_products(id) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT '',
    quantity NUMERIC NOT NULL DEFAULT 0,
    standard_quantity NUMERIC NOT NULL DEFAULT 0,
    cost NUMERIC NOT NULL DEFAULT 0,
    ref_no VARCHAR(255) NOT NULL DEFAULT '',
    ref_doc VARCHAR(255) NOT NULL DEFAULT '',
    remarks VARCHAR(255) NOT NULL DEFAULT '',
    created_by VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) NOT NULL DEFAULT '',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

