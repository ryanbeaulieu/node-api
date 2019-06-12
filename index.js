const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');

const httpServer = http.createServer((req,res) => {
    unifiedServer(req,res);
});

httpServer.listen(config.httpPort, () => {
    console.log( config.envName.toUpperCase() + " ENVIRONMENT");
    console.log('Server is listening on port ' + config.httpPort);
});

const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions,(req,res) => {
    unifiedServer(req,res);
});

httpsServer.listen(config.httpsPort, () => {
    console.log( config.envName.toUpperCase() + " ENVIRONMENT");
    console.log('Server is listening on port ' + config.httpsPort);
});


// All the server logic for both http and https server
const unifiedServer = function(req,res) {
    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get query string parameters as an object
    const queryStringObject = parsedUrl.query;

    // HTTP Method type
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get payloads
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    // data event only gets called if payloads exist (body)
    req.on('data', data => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {

        buffer += decoder.end();

        // Chose the handler for this request
        let chosenHandler;

        if(router[trimmedPath] == undefined) {
            chosenHandler = handlers.notFound;
        }else {
            chosenHandler = router[trimmedPath];
        }

        // Construct data object
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'headers': headers,
            'method': method,
            'payload': buffer
        }

        // Router request to handler
        chosenHandler(data, (statusCode, payload) => {
            // Defualt status code
            statusCode = typeof(statusCode === 'number') ? statusCode : 200;

            // Default payload
            payload = typeof(payload === 'object') ? payload : {};

            //Convert payload to string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(statusCode, payloadString);
        });
    });
}

// Request Router
const router = {
    ping: handlers.ping,
    users: handlers.users
}