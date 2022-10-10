-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS lists;

DROP TABLE IF EXISTS tasks;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR,
  password_hash VARCHAR NOT NULL 
);

CREATE TABLE lists (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT,
  completed BOOLEAN NOT NULL DEFAULT(FALSE),
  description VARCHAR,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO lists (completed,description) VALUES ('true','cleaning'),
('false','coding'),
('true','gardening');