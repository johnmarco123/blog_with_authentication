#### Using this app ####
The only commands you need to get started are the ones that the template used.
These are the following:

npm run clean-db
npm run build-db
npm run start

running all of those commands in order (without clean-db if you haven't used
it before) will get the project up and running without any issues. Then simply
open up http://localhost:3000 and enjoy my project!

## Additional libraries that i've used ## 

BCRYPT: For hashing and storing passwords in the backend. Although it isn't
extremely secure, it is more secure then keeping the passwords naively in
the frontend as said by the assignment. I thought it would be a good idea
to extend my skills by trying to have backend hashed passwords for the first
time


EXPRESS-SESSION: Used to store login cookies so that users wouldn't have to
login for every single page. I've set them to expire after an hour
