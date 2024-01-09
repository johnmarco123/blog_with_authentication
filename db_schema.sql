
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_accounts (
    email_account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT NOT NULL,
    user_id  INT, --the user that the email account belongs to
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    created TEXT NOT NULL,
    last_modified TEXT NOT NULL,
    title TEXT,
    body TEXT,
    published BOOLEAN DEFAULT 0,
    number_of_reads INTEGER DEFAULT 0,
    number_of_likes INTEGER DEFAULT 0
);

-- Insert default data (if necessary here)

-- Set up three users
INSERT INTO users ('user_name', 'password') VALUES ('root', 'toor');
--
---- Give Simon two email addresses and Diane one, but Harry has none
INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('admin@admin.com', 1); 

-- DEFAULT STUFF THAT WAS HERE BEFORE I STARTED EDITING IT
-- Set up three users
--INSERT INTO users ('user_name') VALUES ('Simon Star');
--INSERT INTO users ('user_name') VALUES ('Dianne Dean');
--INSERT INTO users ('user_name') VALUES ('Harry Hilbert');
--
---- Give Simon two email addresses and Diane one, but Harry has none
--INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@gmail.com', 1); 
--INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@hotmail.com', 1); 
--INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('dianne@yahoo.co.uk', 2); 

COMMIT;

