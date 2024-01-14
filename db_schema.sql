-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

-- Here we store users with their passwords for login
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    author_name TEXT
);

-- Each user has one blog, and all articles they have are assosiated to that
-- blog
CREATE TABLE IF NOT EXISTS blogs (
    blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT, --the user that the blog settings belongs to
    blog_title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- These are the articles assossiated with the blog the user has
CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT NOT NULL,  --the user that the articles belongs to
    author_name TEXT NOT NULL, -- the display name that the user has in the users table
    created TEXT NOT NULL,
    last_modified TEXT NOT NULL,
    title TEXT,
    body TEXT,
    published TEXT, -- the time at which it was published
    number_of_views INTEGER DEFAULT 0,
    number_of_likes INTEGER DEFAULT 0
);

-- Here we store the article likes for all articles
CREATE TABLE article_likes (
    like_id INTEGER PRIMARY KEY,
    article_id INTEGER NOT NULL, -- This must match the article from the articles table
    ip_address TEXT,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) -- the articles id that it gets in the articles table
);

-- Here we store the article views for all articles
CREATE TABLE article_views (
    view_id INTEGER PRIMARY KEY,
    article_id INTEGER NOT NULL, -- This must match the article from the articles table
    ip_address TEXT,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) -- the articles id that it gets in the articles table
);

-- Here we store the comments views for all articles
CREATE TABLE article_comments (
    comment_id INTEGER PRIMARY KEY,
    article_id INTEGER NOT NULL, -- This must match the article from the articles table
    created TEXT NOT NULL,
    commenter_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) -- the articles id that it gets in the articles table
);
-- DEFAULT STUFF THAT WAS HERE BEFORE I STARTED EDITING IT
-- Set up three users

--================================================================================
-- BELOW, IS HERE FOR DEMONSTRATION PURPOSES TO HELP SHOW THE BLOGS
-- FUNCTIONALITY AND TO HELP YOU GRADE MY ASSIGNMENT. THIS WOULD BE REMOVED IN
-- A FINAL IMPLAMENTATION IF THIS WAS A REAL BLOG OF COURSE.
--================================================================================

-- These users will be impossible to log into, even with the correct password
-- here As it hashes your input password when you log in and then compares it
-- to the password we are storing in the database, aka this password below.
-- These are just here for demonstration to help you grade my assignment, and
-- to show the functionality of the blog.
INSERT INTO users ('username', "author_name", "password") VALUES ('Spongebob', "Spongebob", "SpongesAreAwesome");
INSERT INTO users ('username', "author_name", "password") VALUES ('Patrick', "Patrick Star", "Starfish62");
INSERT INTO users ('username', "author_name", "password") VALUES ('Krusty Krabs', "Krusty Krabs", "TheSecretRecipe");

-- These numbers and values are extremely specific, one mistake and a post
-- won't be shown or an entire blog. These are usually made by the backend but
-- as i mentioned above this is just for demonstration purposes
INSERT INTO blogs ("user_id", "blog_title", "author_name") VALUES (1, "Spongebobs adventures", "Spongebob");
INSERT INTO blogs ("user_id", "blog_title", "author_name") VALUES (2, "Patricks lounge", "Patrick Star");
INSERT INTO blogs ("user_id", "blog_title", "author_name") VALUES (3, "Money, Money, Monnnnneeeeeyyyy!!!", "Krusty Krabs");

INSERT INTO articles ("user_id", "author_name", "created", "last_modified", "title", "body", "published", "number_of_views", "number_of_likes") VALUES (1, "Spongebob", "2024-01-14 16:55:16", "2024-01-14 16:55:16", "The Cold Morning", "Hello everyone, and welcome to the first Bikini Bottom Blog! I went outside of my pineapple today and it was freezing so bad my snail almost caught a cold!", "2024-01-14 16:55:16", 31, 10);
INSERT INTO articles ("user_id", "author_name", "created", "last_modified", "title", "body", "published", "number_of_views", "number_of_likes") VALUES (1, "Spongebob", "2023-01-14 16:55:16", "2023-01-14 16:55:16", "Planktons Evil Plan", "Today plankton tried to steal Mr.krabs's formula again! Luckily me and patrick caught him since i am a fantastic driver hahahahaha!", "2023-01-14 16:55:16", 91, 25);

INSERT INTO articles ("user_id", "author_name", "created", "last_modified", "title", "body", "published", "number_of_views", "number_of_likes") VALUES (2, "Patrick Star", "2024-01-14 16:55:16", "2024-01-14 16:55:16", "My morning routine", "I wake up, and then, i go back to bed, I just sleep all day until Spongebob wakes me up!", "2024-01-14 16:55:16", 21, 15);

INSERT INTO articles ("user_id", "author_name", "created", "last_modified", "title", "body", "published", "number_of_views", "number_of_likes") VALUES (3, "Krusty Krabs", "2020-01-14 16:55:16", "2020-01-14 16:55:16", "Simply, Money.", "When i wake up I think of money, when i go to bed, i dream of money, when i make money, i'm thinking of how amazing money is. Isn't money just amazing? Spongebob tells me i have a money hoarding problem, but i disagree.", "2024-01-14 16:55:16", 1000, 25);

INSERT INTO article_comments ("article_id", "created", "commenter_name", "comment") VALUES (1, "2024-01-14 16:55:16", "Plankton", "I will find that secret recipe! Why do i write this on every post...");
INSERT INTO article_comments ("article_id", "created", "commenter_name", "comment") VALUES (2, "2024-01-14 16:55:16", "Plankton", "I will find that secret recipe! Why do i write this on every post...");
INSERT INTO article_comments ("article_id", "created", "commenter_name", "comment") VALUES (3, "2024-01-14 16:55:16", "Plankton", "I will find that secret recipe! Why do i write this on every post...");
INSERT INTO article_comments ("article_id", "created", "commenter_name", "comment") VALUES (4, "2024-01-14 16:55:16", "Plankton", "I will find that secret recipe! Why do i write this on every post...");

COMMIT;
