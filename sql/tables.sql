CREATE TABLE waiters (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN
);

CREATE TABLE days (
    id SERIAL PRIMARY KEY,
    day VARCHAR(255) NOT NULL
);

CREATE TABLE shifts (
    waiters_id INT REFERENCES waiters(id),
    days_id INT REFERENCES days(id),
    PRIMARY KEY (waiters_id, days_id)
);