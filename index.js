const express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    fs = require('fs'),
    path = require('path');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
  });

  
// let ListTenMovies = [
//     {
//         title: 'The Fifth Element',
//         year: '1997',
//         genres: ['Sci-fi', 'Action'],
//         country: 'France',    
//         director: 'Luc Besson',
//         starring: ['Bruce Willis', 'Gary Oldman', 'Chris Tucker', 'Milla Jovovich']        
//     },
//     {
//         title: 'Groundhog Day',
//         year: '1993',
//         genres: ['Comedy', 'Romance'],
//         country: 'US',    
//         director: 'Harold Ramis',
//         starring: ['Bill Murray', 'Andie MacDowell', 'Chris Elliott']        
//     },
//     {
//         title: 'The Truman Show',
//         year: '1998',
//         genres: ['Sci-fi', 'Drama'],
//         country: 'US',    
//         director: 'Peter Weir',
//         starring: ['Jim Carrey', 'Laura Linney', 'Noah Emmerich', 'Natascha McElhone', 'Holland Taylor', 'Ed Harris']        
//     },
//     {
//         title: 'Birdman',
//         year: '2014',
//         genres: ['Drama', 'Romance'],
//         country: 'US',    
//         director: 'Alejandro González Iñárritu',
//         starring: ['Michael Keaton', 'Zach Galifianakis', 'Edward Norton', 'Andrea Riseborough', 'Amy Ryan', 'Emma Stone', 'Naomi Watts']        
//     },
//     {
//         title: 'My Neighbor Totoro',
//         year: '1988',
//         genres: ['Fantasy', 'Family'],
//         country: 'Japan',    
//         director: 'Hayao Miyazaki',
//         starring: ['Chika Sakamoto', 'Noriko Hidaka', 'Hitoshi Takagi']        
//     },
//     {
//         title: 'The Lives of Others',
//         year: '2006',
//         genres: ['Drama', 'Thriller'],
//         country: 'Germany',    
//         director: 'Florian Henckel von Donnersmarck',
//         starring: ['Ulrich Mühe', 'Martina Gedeck', 'Sebastian Koch', 'Ulrich Tukur']        
//     },
//     {
//         title: 'Turner & Hooch',
//         year: '1989',
//         genres: ['Comedy', 'Crime'],
//         country: 'US',    
//         director: 'Roger Spottiswoode',
//         starring: ['Tom Hanks']        
//     },
//     {
//         title: 'Close Encounters of the Third Kind',
//         year: '1977',
//         genres: ['Sci-fi', 'Drama'],
//         country: 'US',    
//         director: 'Steven Spielberg',
//         starring: ['Richard Dreyfuss', 'Teri Garr', 'Melinda Dillon', 'François Truffaut', 'Bob Balaban']        
//     },
//     {
//         title: 'The Terminator',
//         year: '1984',
//         genres: ['Sci-fi', 'Action'],
//         country: 'US',    
//         director: 'James Cameron',
//         starring: ['Arnold Schwarzenegger', 'Michael Biehn', 'Linda Hamilton', 'Paul Winfield']        
//     },
//     {
//         title: 'Point Break',
//         year: '1991',
//         genres: ['Action', 'Crime'],
//         country: 'US',    
//         director: 'Kathryn Bigelow',
//         starring: ['Patrick Swayze', 'Keanu Reeves', 'Gary Busey', 'Lori Petty']        
//     }
// ];

let users = [
    {
        id: 1, 
        name: "Big Lebowski",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Marla Singer",
        favoriteMovies: ["Fight Club"]
    }
];

let movies = [
    {
        title: 'The Fifth Element',
        year: '1997',
        genres: {
            name: 'Sci-fi',
            description: "The science fiction (sci-fi) genre encompasses a wide range of imaginative and speculative narratives that often explore futuristic concepts, advanced technology, space exploration, and the impact of scientific advancements on society, individuals, and the universe. Sci-fi stories can be set in the future, alternate realities, or even in the present with elements of advanced science and technology that don't currently exist."
        },
        country: 'France',    
        directors: {
            name: 'Luc Besson',
            birthYear: '1959',
            deathYear: "present",
            bio: "Luc Paul Maurice Besson is a French film director, screenwriter and producer. He directed or produced the films Subway, The Big Blue, and La Femme Nikita."
        },
        imgUrl: '#',
        starring: ['Bruce Willis', 'Gary Oldman', 'Chris Tucker', 'Milla Jovovich'],
        description: "In the colorful future, a cab driver unwittingly becomes the central figure in the search for a legendary cosmic weapon to keep Evil and Mr. Zorg at bay."        
    },
    {
        title: 'Groundhog Day',
        year: '1993',
        genres: {
            name: 'Comedy',
            description: "Comedy is a popular movie genre that aims to entertain and amuse the audience through humor and lighthearted situations. Comedy movies often rely on witty dialogue, funny characters, and comedic situations to generate laughter and provide a sense of joy. There are various subgenres and styles within the comedy genre, each with its own unique characteristics."
        },
        country: 'US',    
        directors: {
            name: 'Harold Ramis',
            birthYear: '1944',
            deathYear: '2014',
            bio: "Harold Allen Ramis was an American actor, comedian, director and writer. His best-known film acting roles were as Egon Spengler in Ghostbusters and Ghostbusters II, and as Russell Ziskey in Stripes; he also co-wrote those films."
        },
        imgUrl: '#',
        starring: ['Bill Murray', 'Andie MacDowell', 'Chris Elliott'],
        description: 'A narcissistic, self-centered weatherman finds himself in a time loop on Groundhog Day, and the day keeps repeating until he gets it right.'
    },
];

// -1- READ/ Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

// -2- READ/ Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('The movie was not found');
    }
})

// -3- READ/ Return data about a genre (description) by name/title
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genres.name === genreName ).genres;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(404).send('The genre was not found');
    }
})

// -4- READ/ Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.directors.name === directorName ).directors;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(404).send('The director was not found');
    }
})

// -5- CREATE/ Allow new users to register
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id= uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('The Username is required')
    }
})

// -6- UPDATE/ Allow users to update their user info (username)
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    // user.id - a number, id - a string => "=="
    let user = users.find( user => user.id == id)

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(404).send('The User was not found');
    }
})

// -7- CREATE/ Allow users to add a movie to their list of favorites
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;    
    // user.id - a number, id - a string => "=="
    let user = users.find( user => user.id == id)

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to User_${id}'s array`);
    } else {
        res.status(404).send('The User was not found');
    }
})

// -8- DELETE/ Allow users to remove a movie from their list of favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;    
    // user.id - a number, id - a string => "=="
    let user = users.find( user => user.id == id)

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from User_${id}'s array`);
    } else {
        res.status(404).send('The User was not found');
    }
})

// -9- DELETE/ Allow existing users to deregister
app.delete('/users/:id', (req, res) => {
    const { id, movieTitle } = req.params;    
    // user.id - a number, id - a string => "=="
    let user = users.find( user => user.id == id)

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`User_${id} has been deleted`);
    } else {
        res.status(404).send('The User was not found');
    }
})



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