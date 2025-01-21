##  Snap News API

This project serves as the backend for my snap news application, providing endpoints for accessing articles, comments, users. The endporints support various operations such as retrieving articles, posting comments, updating votes on articles, and so on.

## Link to hosted version
[Click here to fint the API](https://project-nc-news-xiaoru-sun.onrender.com/api)

## Introduction
####  Tech Stack
This project was built using Node, PSQL and Express, along with through testing using Jest and Supertest.


## Getting Started
To run or contribute to this project, follow the steps below.
1. Clone the repository to your local machine using one of the following commands:<br>
   clone with ssh:
   ```sh
   git clone git@github.com:Xiaoru-Sun/my-bankend-project.git
   ```

   clone with https:
   ```sh
   git clone https://github.com/Xiaoru-Sun/my-bankend-project.git
   ```

2. Install Project Dependencies
   ```sh
   npm install
   ```

3. Environment Variables
   Create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
   You will have to install npm dotevn package at this point. The command to install dotenv package is:

   ```sh
   npm install dotenv --save
   ```

4. Seed Local Database:
   To seed the development database, please run
   ```sh
   npm seed
   ```
   To seed the production database, please run
   ```sh
   npm seed-prod
   ```

5. Run Tests
   Each time you run tests, the test database will be seeded automatically. To run tests, please use:
   ```sh
   npm test
   ```

Minimum versions: 
   Node.js: v21.6.1.
   PostgresSQL: 14.11


## **Contributing**
If you have a suggestion that would make this better, please fork the repo and create a pull request. Thanks!
1. Fork the repository
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Make your changes
4. Write tests to ensure your changes work as expected
5. Run tests to verify everything works
6. Commit your changes (git commit -m 'Add some AmazingFeature')
7. Push your changes to the branch(git push origin feature/AmazingFeature)
8. Submit a pull request
