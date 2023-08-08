const express = require("express");
    morgan = require('morgan'),
    // import built in node modules fs and path 
    fs = require('fs'),
    path = require('path');
const app = express();


let ListTenMovies = [
    {
        title: 'The Fifth Element',
        year: '1997',
        genres: ['Sci-fi', 'Action'],
        country: 'France',    
        director: 'Luc Besson',
        starring: ['Bruce Willis', 'Gary Oldman', 'Chris Tucker', 'Milla Jovovich']        
    },
    {
        title: 'Groundhog Day',
        year: '1993',
        genres: ['Comedy', 'Romance'],
        country: 'US',    
        director: 'Harold Ramis',
        starring: ['Bill Murray', 'Andie MacDowell', 'Chris Elliott']        
    },
    {
        title: 'The Truman Show',
        year: '1998',
        genres: ['Sci-fi', 'Drama'],
        country: 'US',    
        director: 'Peter Weir',
        starring: ['Jim Carrey', 'Laura Linney', 'Noah Emmerich', 'Natascha McElhone', 'Holland Taylor', 'Ed Harris']        
    },
    {
        title: 'Birdman',
        year: '2014',
        genres: ['Drama', 'Romance'],
        country: 'US',    
        director: 'Alejandro González Iñárritu',
        starring: ['Michael Keaton', 'Zach Galifianakis', 'Edward Norton', 'Andrea Riseborough', 'Amy Ryan', 'Emma Stone', 'Naomi Watts']        
    },
    {
        title: 'My Neighbor Totoro',
        year: '1988',
        genres: ['Fantasy', 'Family'],
        country: 'Japan',    
        director: 'Hayao Miyazaki',
        starring: ['Chika Sakamoto', 'Noriko Hidaka', 'Hitoshi Takagi']        
    },
    {
        title: 'The Lives of Others',
        year: '2006',
        genres: ['Drama', 'Thriller'],
        country: 'Germany',    
        director: 'Florian Henckel von Donnersmarck',
        starring: ['Ulrich Mühe', 'Martina Gedeck', 'Sebastian Koch', 'Ulrich Tukur']        
    },
    {
        title: 'Turner & Hooch',
        year: '1989',
        genres: ['Comedy', 'Crime'],
        country: 'US',    
        director: 'Roger Spottiswoode',
        starring: ['Tom Hanks']        
    },
    {
        title: 'Close Encounters of the Third Kind',
        year: '1977',
        genres: ['Sci-fi', 'Drama'],
        country: 'US',    
        director: 'Steven Spielberg',
        starring: ['Richard Dreyfuss', 'Teri Garr', 'Melinda Dillon', 'François Truffaut', 'Bob Balaban']        
    },
    {
        title: 'The Terminator',
        year: '1984',
        genres: ['Sci-fi', 'Action'],
        country: 'US',    
        director: 'James Cameron',
        starring: ['Arnold Schwarzenegger', 'Michael Biehn', 'Linda Hamilton', 'Paul Winfield']        
    },
    {
        title: 'Point Break',
        year: '1991',
        genres: ['Action', 'Crime'],
        country: 'US',    
        director: 'Kathryn Bigelow',
        starring: ['Patrick Swayze', 'Keanu Reeves', 'Gary Busey', 'Lori Petty']        
    }
]

// The method creates a writeable stream (in append (flags: 'a') mode) for writing date sequentially to a destination - a file 'log.txt'
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// Adds logging middleware Morgan to log HTTP requests
app.use(morgan('combined', {stream: accessLogStream}));

//  A built-in middleware function serves static files from the specified directory
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
    res.json(ListTenMovies);
})


// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    // 500 Internal Server Error
    res.status(500).send('An unexpected condition was encountered by the server');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});