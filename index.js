const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');    
// const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app); //  import the “auth.js” file
const passport = require('passport'); // Passport module
require('./passport'); // import the “passport.js” file

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});





// -Start page-
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});


// -1- READ/ Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
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
app.post('/users', async (req, res) => { 
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exist');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => { res.status(201).json(user) })
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
});


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
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => { 
    await Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => { 
    await Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $push: { FavoriteMovies: req.params.MovieID }},
    { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
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


app.listen(8888, () => {
  console.log('Server is running on port 8888');
});