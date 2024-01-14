
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

-- Here we store users with their passwords for login
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    privileges TEXT,
    author_name TEXT
);

-- CREATE TABLE IF NOT EXISTS email_accounts (
--     email_account_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     email_address TEXT NOT NULL,
--     user_id INT, --the user that the email account belongs to
--     FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );

CREATE TABLE IF NOT EXISTS blog_settings (
    blog_settings_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT, --the user that the blog settings belongs to
    blog_title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT,  --the user that the articles belongs to
    author_name TEXT NOT NULL, -- the display name that the user has in the users table
    created TEXT NOT NULL,
    last_modified TEXT NOT NULL,
    title TEXT,
    body TEXT,
    published TEXT, -- the time at which it was published
    number_of_views INTEGER DEFAULT 0,
    number_of_likes INTEGER DEFAULT 0,
    ips_who_liked_the_post TEXT
);

CREATE TABLE article_likes (
    like_id INTEGER PRIMARY KEY,
    article_id INTEGER NOT NULL,
    ip_address TEXT,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) -- the articles id that it gets in the articles table
);

CREATE TABLE article_views (
    view_id INTEGER PRIMARY KEY,
    article_id INTEGER NOT NULL,
    ip_address TEXT,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) -- the articles id that it gets in the articles table
);

CREATE TABLE article_comments (
    view_id INTEGER PRIMARY KEY,
    article_id INTEGER NOT NULL,
    created TEXT NOT NULL,
    commenter_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) -- the articles id that it gets in the articles table
);
-- DEFAULT STUFF THAT WAS HERE BEFORE I STARTED EDITING IT
-- Set up three users
--INSERT INTO users ('user_name') VALUES ('Dianne Dean');
--INSERT INTO users ('user_name') VALUES ('Harry Hilbert');
--
---- Give Simon two email addresses and Diane one, but Harry has none
--INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@gmail.com', 1); 
--INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@hotmail.com', 1); 
--INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('dianne@yahoo.co.uk', 2); 

INSERT INTO articles ('user_id', 'author_name', 'created', 'last_modified', 'title', 'body', 'published') VALUES ('-1', 'Patrick star', '2014-02-25 11:11:11', '2014-02-25 11:11:11', "Spongebob", "Spongebob is a great show! I'm on it!", "2014-03-25 12:58:33");
COMMIT;
