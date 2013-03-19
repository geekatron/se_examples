/**
 * Created with JetBrains WebStorm.
 * Date: 2013-03-19
 * Time: 10:44 AM
 * @author Adam C. Nowak
 * @description
 */

"use strict";

var express = require('express');
var app = module.exports = express.createServer();

global.debug =  (process.env.DEBUG_MODE == 'true') || false;

//Include the Environment JS
require('./config/environment.js')(app, express);
//      Routes for ICE-M Service
//Routes for CORS Support
require('./config/routes/route_cors')(app);
//Routes for Resources
require('./config/routes/route_resources')(app);


//Using the following strings as specified by Cloud9/Heroku
var processport = process.env.PORT;

if(processport == undefined)
    processport = 5050;

app.listen(processport);
//Print out the port on startup
console.log("Port for node.js process: " + processport);
//app.listen(33846);
console.log('DEX Address: ' + prd.address);
console.log('KB Address: ' + prd.kb);
console.log('EB Address: ' + prd.eb);
console.log('SB Address: ' + prd.sb);
//Get the address for the Application
//console.log('APP Address: ' + app.address());
