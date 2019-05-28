# Pinit!

This project provides a pinboard for learning resrouces. You can view and search all resources added by all users on the homepage and click on each individually for more information including an external URL link to the resource site. Once logged in you can add comments/likes/rating to resources added by other and save these in your favourites page. You can also add your own external resources which will also be added to your favourites page.

## Getting Started

1. Install dependencies listed below.
2. Fix to binaries for sass: `npm rebuild node-sass`
3. Run 'clean_db.sh' to create DB, run lastest migration and run the seed.
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- body-parser
- cookie-parser
- dotenv
- ejs 
- express
- knex
- knex-logger
- method-override
- morgan
- node-sass-middleware
- pg
- nodemon
