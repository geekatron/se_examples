/**
 * Created with JetBrains WebStorm.
 * Date: 2013-03-19
 * Time: 11:00 AM
 * @author Adam C. Nowak
 * @description
 */

"use strict";

//required artifacts
var routing_error = require('../../libs/utils/routing/routing_error');

//Include npm modules
var _ = require("underscore"),
    httpProxy = require('http-proxy');

module.exports = function(app) {
    var error = Object.create(routing_error);
    /************************************************************
     *  FUNCTIONALITY RELATED TO Misc - playground
     *************************************************************/

    app.get('/', function(req, res){
        res.send('Hello world! You rock man!');
    });

    app.get('/configuration/', function(req, res){
        var val = {'configuration' : prd};
        res.send(val);
    });

    /**
     * RESTful Examples
     * Addition of Two Numbers
     */
    app.post('/examples/addition/', function(req, res) {
        //Retrieve the variable from the Query string
        var a = req.query.a,
            b = req.query.b,
            result = 0;

        //Check to make sure that both variables are defined

        //Add the two numbers together
        result = a + b;

        var msg = "The addition of a(" + a + ") and b(" + b + ") is: " + result;

        res.send(msg);

        function handleAuth(err, data) {
            //Error - handle error response
            if( !_.isUndefined(err) ) {
                res.send(err.statuscode, err.message);
            } else {
                //Print out the session id as debug
                console.log("Session id from report server: " + data );

                var session =
                {
                    kind : 'ice-m#SessionId',
                    sessionid : data
                };

                res.send(session);
            }
        }//END handleAuth
    });

};