##  Snap News API

A RESTful API backend that enables full CRUD operations for the [Snap News Web project](https://github.com/Xiaoru-Sun/snap-news-web)

## Link to hosted version
API: [Snap news API](https://project-nc-news-xiaoru-sun.onrender.com/api)

## Introduction
This project serves as the backend for my snap news application, providing endpoints for accessing articles, comments, users. It supports a variety of operations, such as retrieving articles, posting comments, and updating votes on articles.

####  Tech Stack
+ Node
+ PostgreSQL (PSQL)
+ Express
+ Jest(Testing Framework)
+ Supertest(HTTP Assertions)

## Getting Started
Follow these steps to set up the project locally or contribute to it.
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
   Navigate to the project directory and install the required dependencies:
   ```sh
   npm install
   ```

3. Set Up Environment Variables
   Create two .env files for your project: .env.test and .env.development.Ensure that these .env files are .gitignored. Each file should contain the following:
   ```env
   PGDATABASE=<your_database_name>
   ```
   
   You'll need the dotenv package to manage environment variables. Install it with:

   ```sh
   npm install dotenv --save
   ```

4. Seed Local Database:
   To seed the development database, please run:
   ```sh
   npm seed
   ```
   To seed the production database, please run:
   ```sh
   npm seed-prod
   ```

5. Run Tests
   Each time you run tests, the test database will be seeded automatically. To run tests, please execute:
   ```sh
   npm test
   ```

#### Minimum versions: 
+ Node.js: v21.6.1.
+ PostgresSQL: 14.11


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

Thank you for checking out the Snap News API! Feel free to reach out with suggestions or feedback.
