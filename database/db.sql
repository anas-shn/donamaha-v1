-- 1. Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nim VARCHAR(30),
    role VARCHAR(25),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: campaigns
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    organizer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    full_description TEXT,
    target_amount INT NOT NULL,
    collected_amount INT NOT NULL DEFAULT 0,
    status VARCHAR(50),
    image_path VARCHAR(512),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: donations
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    campaign_id INT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    donor_id INT REFERENCES users(id) ON DELETE SET NULL, -- Bisa NULL jika user dihapus atau donasi anonim
    amount INT NOT NULL,
    note VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    donation_id INT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    payment_method VARCHAR(100),
    payment_status VARCHAR(50),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: reports
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    campaign_id INT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT,
    image_path VARCHAR(512),
    total_spent INT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
