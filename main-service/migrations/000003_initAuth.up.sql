-- Create the user reset password table
CREATE TABLE IF NOT EXISTS users_reset_password (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    token VARCHAR(255) NOT NULL DEFAULT '',
    expires TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
