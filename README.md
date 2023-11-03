# Movie API (myFlix app server-side component)

This API (Application Programming Interface) is the server-side component of the myFlix web application, which serves as the backend for managing and providing access to information about different movies, directors, and genres. Users can create profiles, save their favorite movies, and more. The actual storage of data is managed by a database, and this component handles the retrieval and processing of that data.

This project is built using the MERN (MongoDB, Express, React, and Node.js) stack.

## Table of Contents
- [User Stories](#user-stories)
- [Essential Features](#essential-features)
- [Technical Requirements](#technical-requirements)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Data Validation](#data-validation)
- [Data Security](#data-security)
- [Testing the API with Postman](#testing-the-api-with-postman)
- [Deployment](#deployment)
- [Contributing](#contributing)

## User Stories

- As a user, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I've watched or am interested in.
- As a user, I want to be able to create a profile so I can save data about my favorite movies.

## Essential Features

- Return a list of ALL movies to the user.
- Return data (description, genre, director, image URL, whether it's featured or not) about a single movie by title to the user.
- Return data about a genre (description) by name/title (e.g., "Thriller").
- Return data about a director (bio, birth year, death year) by name.
- Allow new users to register.
- Allow users to update their user info (username, password, email, date of birth).
- Allow users to add a movie to their list of favorites.
- Allow users to remove a movie from their list of favorites.
- Allow existing users to deregister.

## Technical Requirements

- The API must be a Node.js and Express application.
- The API must use REST architecture, with URL endpoints corresponding to the data operations listed above.
- The API must use at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging.
- The API must use a "package.json" file.
- The database must be built using MongoDB.
- The business logic must be modeled with Mongoose.
- The API must provide movie information in JSON format.
- The JavaScript code must be error-free.
- The API must be tested in Postman.
- The API must include user authentication and authorization code.
- The API must include data validation logic.
- The API must meet data security regulations.
- The API source code must be deployed to a publicly accessible platform like GitHub.
- The API must be deployed to Heroku.

## Project Structure

The project follows a standard Node.js project structure. Here are some of the key directories and files:

- `app.js`: The main application file.
- `models/`: Contains Mongoose models for movies, users, and other data entities.
- `routes/`: Defines the API routes and controllers.
- `middleware/`: Contains middleware for authentication, error handling, and data validation.
- `config/`: Stores configuration settings for the application.
- `public/`: For static assets like images.
- `tests/`: Contains unit and integration tests.
- `package.json`: Lists project dependencies and scripts.
- `.env`: Store environment-specific configuration (e.g., database connection strings and JWT secrets).

## Setup

To run the myFlix server-side component, follow these steps:

1. Clone this repository to your local machine:

```
git clone https://github.com/nastja4/movie_api.git
```

2. Navigate to the project directory:

```
cd movie_api
```

3. Install the project dependencies:

To install Node, a version management tool called nvm (Node Version Manager) was used to install a specific and reliable version of Node. This tool allows you to easily upgrade (and downgrade if necessary) your version of Node to the latest LTS (long-term support) version.
[NVM for Windows](https://github.com/coreybutler/nvm-windows#readme)
[nvm’s GitHub repository page](https://github.com/nvm-sh/nvm)

The following command to install all packages mentioned in the “package.json” file at once:

```
npm install
```

To install Express, run the following command in the terminal: 

```
npm install express
```
To install body-parser, run the following command in the terminal: 

```
npm install body-parser
```

To install Morgan - logging middleware for Express:

```
npm install morgan
```

To install Express, Body-parser, and Uuid (to generate universally unique identifiers):

```
npm install --save express uuid body-parser
```

4. Start the server:

```
npm start
```
The server will be running on `http://localhost:8888`.


## API Endpoints

The API exposes the following endpoints:

- `GET /movies`: Get a list of all movies.
- `GET /movies/:title`: Get information about a specific movie by title.
- `GET /movies/genres/:genre`: Get information about a specific genre by name.
- `GET /movies/directors/:director`: Get information about a specific director by name.
- `POST /users`: Register a new user.
- `PUT /users/:username`: Update user information.
- `POST /users/:username/movies/:movieID`: Add a movie to the user's favorites.
- `DELETE /users/:username/movies/:movieID`: Remove a movie from the user's favorites.
- `DELETE /users/:username`: Deregister (delete) a user.

## Authentication

The API includes user authentication using basic HTTP authentication and JWT (token-based) authentication. To access protected endpoints, users must include their credentials (username and password) in the request headers.

## Data Validation

Data validation is implemented to ensure that requests meet the required data format and constraints. Middleware is used to validate user inputs and reject invalid requests.

## Data Security

The API follows security best practices to protect user data and ensure secure communication. It includes features like HTTPS and password hashing.

## Testing the API with Postman

Postman, a popular tool designed for API development, allows you to test different aspects of your API, including its URL endpoints.
Start by downloading [Postman](https://www.postman.com/downloads/](https://www.postman.com/downloads/).

By using Postman to test your API, you can ensure that your endpoints are functioning as expected and that your API provides the correct responses to client requests.

Screenshot:

<img src="https://github.com/nastja4/movie_api/assets/126527606/8b851200-3025-48a8-9cb0-cf3b1a0efd01" alt="Screenshot" width="700px">

## Deployment

The project is deployed on Heroku and can be accessed at [https://movies-my-flix-307c49ee24e7.herokuapp.com/](https://movies-my-flix-307c49ee24e7.herokuapp.com/).

## Contributing

Contributions are welcome. If you'd like to contribute to this project, please follow standard GitHub flow: fork, create a branch, make your changes, and submit a pull request.

