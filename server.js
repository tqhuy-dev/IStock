require('dotenv').config();
const http = require('http');
const express = require('express');
const port = process.env.port;
const app = require('./app');

const server = http.createServer(app);

server.listen(port , function(){
    console.log('server is starting at port ' + port);
})