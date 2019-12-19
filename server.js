const http = require('http');
const https = require('https')
const app = require('./app')
const port = process.env.port || 4000;
const HTTPS_PORT = process.env.port || 8443;
//const server = http.createServer(app);
var fs = require('fs');
var options = {
    pfx: fs.readFileSync('./certs/node.pfx'),
    passphrase: 'Singapore$11',
    requestCert: false,
    rejectUnauthorized: false
};

https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(' HTTPS Server Listening...')
  })


//https.createServer(options, function (req, res) {
//    res.end('secure!');
//}).listen(HTTPS_PORT);



//server.listen(port, ()=> console.log(`Server is running on port ${port}`));

http.createServer(app).listen(port)

//http.createServer(function (req, res) {
//    console.log(req.headers, req.url)
//    res.writeHead(301, { "Location": "https://localhost:8443" + req.url });
//    res.end();
//}).listen(port);

