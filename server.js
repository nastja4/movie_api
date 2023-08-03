const http = require('http'),
    fs = require('fs'),
    url = require('url');

http.createServer((request, response) => {
    let addr = request.url,
        q = url.parse(addr, true),
        filePath = '';

    // A log of recent requests made to my server. Whenever a request is made to the server, you’ll add the visited URL, as well as the timestamp at which the request was received //
    fs.appendFile('log.txt', 'URL: ' + addr + '\n Timestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html'); //? what is dirname
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
    });

}).listen(8080);

console.log('My test server is running on Port 8080.');
