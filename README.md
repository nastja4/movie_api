# movie_api (myFlix app server-side component)

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
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

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

## Testing



## Deployment

## Deployment

The project is deployed on Heroku and can be accessed at [https://movies-my-flix-307c49ee24e7.herokuapp.com/](https://movies-my-flix-307c49ee24e7.herokuapp.com/).

## Contributing

Contributions are welcome. If you'd like to contribute to this project, please follow standard GitHub flow: fork, create a branch, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



