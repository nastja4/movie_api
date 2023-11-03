const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');    
// const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();


// app.use(cors());

// if you want only certain origins to be given access, you’ll need to replace app.use(cors()); with the following code:
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
let allowedOrigins = ['http://localhost:4200', 'http://localhost:8080', 'http://localhost:8888', 'http://testsite.com', 'http://localhost:1234', 'https://movie-myflix.netlify.app', 'https://nastja4.github.io'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));


const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app); //  import the “auth.js” file

const passport = require('passport'); // Passport module
require('./passport'); // import the “passport.js” file

const Movies = Models.Movie;
const Users = Models.User;

/* To connect to my local database via Mongoose */
// mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
// });

/* To connect to MongoDB Atlas online database via Mongoose */
mongoose.connect(process.env.CONNECTION_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});


// -Start page-
/**
 * Handle the start page of the movie app.
 *
 * This route handler is responsible for serving the start page of the movie app, 
 * displaying a welcome message to users.
 *
 * @function
 * @name GET / 
 * @returns {string} - A welcome message.
 */
app.get('/', (req, res) => {
    res.send("Welcome to my movie app - myFlix!");
});

// -GET a user info-
/**
 * Get user information by username.
 *
 * This route handler is responsible for retrieving user information based on the provided username.
 *
 * @function
 * @name GET /users/:username
 * @param {string} req.params.username - The username parameter extracted from the URL.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves to the user information as an object or rejects with an error message.
 * @example
 * // Example Response (Success)
 * {
 *   "_id": "user_id",
 *   "Username": "username",
 *   "Password": "hashed_password",
 *   "Email": "user_email",
 *   "Birthday": null,
 *   "FavoriteMovies": [
 *     "64daa854eb2a630f9010668d",
 *     "64db62f0b9b61cd4d7136214"
 *   ],
 *   "__v": 0
 * }
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.username })
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// -GET all the users-
/**
 * Get a list of all users.
 *
 * This route handler is responsible for retrieving a list of all users from the database.
 *
 * @function
 * @name GET /users
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves to an array of user objects or rejects with an error message.
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



// -1- READ/ Return a list of ALL movies to the user
/**
 * Get a list of all movies.
 *
 * This route handler is responsible for retrieving a list of all movies.
 *
 * @function
 * @name GET /movies
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves to an array of movie objects or rejects with an error message.
 */
app.get('/movies', /* passport.authenticate('jwt', { session: false }), */ async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// -2- READ/ Return data about a single movie by title to the user
/**
 * Get movie information by title.
 *
 * This route handler is responsible for retrieving movie information based on the provided movie title.
 *
 * @function
 * @name GET /movies/:Title
 * @param {string} req.params.Title - The movie title parameter extracted from the URL.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves to the movie information as an object or rejects with an error message.
 *
 * @example
 * // Example Response (Success)
 * {
 *   "Genre": {
 *     "Name": "Drama",
 *     "Description": "genre_description"
 *   },
 *   "Director": {
 *     "Name": "director_name",
 *     "Bio": "director_bio",
 *     "Birth": "1963",
 *     "Death": "-"
 *   },
 *   "_id": "movie_id",
 *   "Title": "21 Grams",
 *   "Description": "movie_synopsis",
 *   "ImagePath": "https://....jpg",
 *   "Featured": "true or false"
 * }
 */
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title})
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// -3- READ/ Return data about a genre (description) by name
/**
 * Get movies by genre name.
 *
 * This route handler is responsible for retrieving movies based on the provided genre name.
 *
 * @function
 * @name GET /movies/genres/:genreName
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.genreName - The genre name parameter extracted from the URL.
 * @returns {Promise<void>} - A promise that resolves with the genre information or rejects with an error message.
 *
 * @example
 * // Example Response (Success)
 * {
 *   "Name": "genre_name",
 *   "Description": "genre_description"
 * }
 */
app.get('/movies/genres/:genreName', passport.authenticate('jwt', {session: false}), async (req, res) => { 
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((movie) => {
            if (!movie) {
                return res.status(404).send('Error: ' + req.params.genreName + ' was not found'); 
            } else {
                res.status(200).json(movie.Genre);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// -4- READ/ Return data about a director (bio, birth year, death year) by name
/**
 * Get movies by director name.
 *
 * This route handler is responsible for retrieving movies based on the provided director name.
 *
 * @function
 * @name GET /movies/directors/:directorName
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves with the director information or rejects with an error message.
 *
 * @param {string} req.params.directorName - The director name parameter extracted from the URL.
 * @example
 * // Example Response (Success)
 * {
 *   "Name": "director_name",
 *   "Bio": "director_bio",
 *   "Birth": "director_birthyear",
 *   "Death": "director_deathyear"
 * }
 */
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false}), async (req, res) => { 
    await Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movie) => {
            if (!movie) {
                return res.status(404).send('Error: ' + req.params.directorName + ' was not found'); 
            } else {
                res.status(200).json(movie.Director);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// -5- CREATE/ Allow new users to register
/**
 * Create a new user.
 *
 * This route handler is responsible for creating a new user based on the provided user information.
 *
 * @function
 * @name POST /users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves with the newly created user or rejects with an error message.
 *
 * @param {Object} req.body - The request body containing user information.
 * @param {string} req.body.Username - The username of the user to be created.
 * @param {string} req.body.Password - The password of the user to be created.
 * @param {string} req.body.Email - The email of the user to be created.
 * @param {string} req.body.Birthday - The birthday of the user to be created.
 *
 * @example
 * // Example Request Body
 * {
 *   "Username": "new_user",
 *   "Password": "password123",
 *   "Email": "new_user@example.com",
 *   "Birthday": "2000-01-01"
 * }
 *
 * // Example Response (Success)
 * {
 *   "Username": "new_user",
 *   "Password": "hashed_password",
 *   "Email": "new_user@example.com",
 *   "Birthday": "2000-01-01",
 *   "FavoriteMovies": [],
 *   "_id": "user_id",
 *   "__v": 0
 * }
 *
 * // Example Response (Validation Error)
 * {
 *   "errors": [
 *     {
 *       "value": "new_user",
 *       "msg": "Username is required",
 *       "param": "Username",
 *       "location": "body"
 *     },
 *     // ... (other validation error objects)
 *   ]
 * }
 *
 * // Example Response (User Already Exists)
 * "new_user already exists"
 */
app.post('/users', 
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()

    ], async (req, res) => { 
        // check the validation object for errors
        let errors = validationResult(req); 

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password); // Using the function hashPassword (in models.js) to hash the password before storing it
        await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + ' already exist');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword, // function hashPassword
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(200).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });        
    }
);


// -6- UPDATE/ Allow users to update their user info (username)
/**
 * Update user information by username.
 *
 * This route handler is responsible for updating user information based on the provided username.
 *
 * @function
 * @name PUT /users/:Username
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves with the updated user information or rejects with an error message.
 *
 * @param {string} req.params.Username - The username parameter extracted from the URL.
 * @param {string} req.body.Username - The updated username.
 * @param {string} req.body.Password - The updated password.
 * @param {string} req.body.Email - The updated email.
 * @param {string} req.body.Birthday - The updated birthday.
 *
 * @example
 * // Example Request Body
 * {
 *   "Username": "new_username",
 *   "Password": "new_password",
 *   "Email": "new_email@example.com",
 *   "Birthday": "new_birthday"
 * }
 *
 * // Example Response (Success)
 * {
 *   "Username": "new_user",
 *   "Password": "new_hashed_password",
 *   "Email": "new_email@example.com",
 *   "Birthday": "new_birthday",
 *   "FavoriteMovies": [],
 *   "_id": "user_id",
 *   "__v": 0
 * }
 */
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), 
    [        
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()  

    ], async (req, res) => { 
        // check the validation object for errors
        let errors = validationResult(req); 

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // Condition to check the current user
        if(req.user.Username !== req.params.Username){
            return res.status(400).send('Permission denied');
        }
        // Condition ends
        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOneAndUpdate({ Username: req.params.Username }, 
        { $set:
            {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
        { new: true }) // This line makes sure that the updated document is returned
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })    
});


// -7- CREATE/ Allow users to add a movie to their list of favorites
/**
 * Add a movie to a user's list of favorite movies.
 *
 * This route handler is responsible for adding a movie (_id) to a user's list of favorite movies. If the movie is already in the list, it will not be duplicated.
 *
 * @function
 * @name POST /users/:Username/movies/:MovieID
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves with the updated user information or rejects with an error message.
 *
 * @param {string} req.params.Username - The username parameter extracted from the URL.
 * @param {string} req.params.MovieID - The movie ID parameter extracted from the URL.
 * @example
 * // Example Response (Success)
 * {
 *   "_id": "user_id",
 *   "Username": "username",
 *   // ... (other user properties)
 *   "FavoriteMovies": ["movie_id_1", "movie_id_2", ...],
 *   "__v": 0
 * }
 * @example
 * // Example Response (Error)
 * {
 *   "message": "The user has not been found or this movie is already in the list of favorites."
 * }
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => { 
    await Users.findOneAndUpdate(
        {             
            Username: req.params.Username, 
            FavoriteMovies: { $ne: req.params.MovieID } // Checks whether the movie is already in the FavoriteMovies array using the $ne (not equal) operator
        },
        { $addToSet: { FavoriteMovies: req.params.MovieID } },
        { new: true }) // This line makes sure that the updated document is returned
            .then((updatedUser) => {
                if (updatedUser) {                
                    res.json(updatedUser);
                } else {
                    res.status(404).send('The user has not been found or this movie is already in the list of favorites.');
                }            
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
});


// -8- DELETE/ Allow users to remove a movie from their list of favorites
/**
 * Remove a movie from a user's list of favorite movies.
 *
 * This route handler is responsible for removing a movie from a user's list of favorite movies based on the provided user's username and the movie ID.
 *
 * @function
 * @name DELETE /users/:Username/movies/:MovieID
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves with the updated user information or rejects with an error message.
 * 
 * @param {string} req.params.Username - The username parameter extracted from the URL.
 * @param {string} req.params.MovieID - The movie ID parameter extracted from the URL.
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => {     
    await Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $pull: { FavoriteMovies: req.params.MovieID }},
    { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// -9- DELETE/ Allow existing users to deregister (by username)
/**
 * Delete a user by username.
 *
 * This route handler is responsible for deleting a user based on the provided username.
 *
 * @function
 * @name DELETE /users/:Username
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves with a success message or rejects with an error message.
 *
 * @param {string} req.params.Username - The username parameter extracted from the URL.
 * @example
 * // Example Response (Success)
 * "username was deleted."
 * 
 * // Example Response (User Not Found)
 * "username was not found"
 */
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => { 
    await Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});




// The method creates a writeable stream (in append (flags: 'a') mode) for writing date sequentially to a destination - a file 'log.txt'
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// Adds logging middleware Morgan to log HTTP requests
app.use(morgan('combined', {stream: accessLogStream}));

//  A built-in middleware function serves static files from the specified directory
app.use(express.static('public'));

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    // 500 Internal Server Error
    res.status(500).send('An unexpected condition was encountered by the server');
});


const port = process.env.PORT || 8888;
app.listen(port, '0.0.0.0', () => {
  console.log('Server is running on port ' + port);
});