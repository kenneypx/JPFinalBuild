const http = require('http');
const https = require('https')
const app = require('./app')
const port = process.env.port || 4000;
const HTTPS_PORT = process.env.port || 8443;
//const server = http.createServer(app);
var fs = require('fs');
const caBundle =  fs.readFileSync('./certs/digitaltech_systems.ca-bundle',{encoding:'utf8'});
const ca = caBundle.split('-----END CERTIFICATE-----\r\n') .map(cert => cert +'-----END CERTIFICATE-----\r\n');


var options = {
  key: fs.readFileSync("./certs/DigitalTech.key"),

  cert: fs.readFileSync('./certs/digitaltech_systems.crt'),

  ca: ca

  //  ca: fs.readFileSync('./certs/digitaltech_systems.ca-bundle'),
  //  requestCert: false,
  //  rejectUnauthorized: false
};

// We had to remove one extra item that is present due to
// an extra line at the end of the file.
// This may or may not be needed depending on the formatting
// of your .ca-bundle file.
ca.pop();

https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(' HTTPS Server Listening...')
  })


//https.createServer(options, function (req, res) {
//    res.end('secure!');
//}).listen(HTTPS_PORT);



//server.listen(port, ()=> console.log(`Server is running on port ${port}`));

//http.createServer(app).listen(port)

http.createServer(function (req, res) {
    console.log(req.headers, req.url)
    res.writeHead(302, { "Location": "https://digitaltech.systems:8443" + req.url });
    res.end();
}).listen(port);

