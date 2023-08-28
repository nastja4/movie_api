
// if you want only certain origins to be given access, you’ll need to replace app.use(cors()); with the following code:
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));


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

app.use(cors());

const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app); //  import the “auth.js” file

const passport = require('passport'); // Passport module
require('./passport'); // import the “passport.js” file

const Movies = Models.Movie;
const Users = Models.User;

/* To connect to my local database via Mongoose */
mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

/* To connect to MongoDB Atlas online database via Mongoose */
// mongoose.connect(process.env.CONNECTION_URI, { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
// });


// -Start page-
app.get('/', (req, res) => {
    res.send("Welcome to my movie app - myFlix! You're on the start page");
});

// -GET a user info-
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
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
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


// -3- READ/ Return data about a genre (description) by name/title
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

/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
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

/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
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

// app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => { 
//     await Users.findOneAndUpdate({ Username: req.params.Username }, 
//     { $push: { FavoriteMovies: req.params.MovieID }},
//     { new: true }) // This line makes sure that the updated document is returned
//         .then((updatedUser) => {
//             res.json(updatedUser);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Error: ' + err);
//         });
// });
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