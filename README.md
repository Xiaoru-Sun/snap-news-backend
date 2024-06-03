# Northcoders News API

This project serves as the backend for a news-related application, providing endpoints for accessing articles, comments, users. The endporints support various operations such as retrieving articles, posting comments, updating votes on articles, and so on.

This project was built using Node, PSQL and Express, along with through testing using Jest and Supertest.

Find this api via https://project-nc-news-xiaoru-sun.onrender.com/api

1. Clone The Repository
   Clone the repository to your local machine using one of the following commands:

   clone with ssh: git clone git@github.com:Xiaoru-Sun/my-bankend-project.git

   clone with https: git clone https://github.com/Xiaoru-Sun/my-bankend-project.git

2. Install Project Dependencies
   Please make sure you have Node.js and npm package manager installed on your local machine before you start. If you have both, use the below command:

   "npm install"

3. Environment Variables
   Create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
   You will have to install npm dotevn package at this point. The command to install dotenv package is:

   "npm install dotenv --save"

4. Seed Local Database:
   To seed the development database, please run
   "npm seed"

   To seed the production database, please run
   "npm seed-prod"

5. Run Tests
   Each time you run tests, the test database will be seeded automatically. To run tests, please use:
   "npm test"

6. Minimum versions
   Node.js: v21.6.1.
   PostgresSQL: 14.11
