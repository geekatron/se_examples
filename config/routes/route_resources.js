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
     
     
    //app.post('/examples/addition/', function(req, res) {
    app.get('/examples/addition/', function(req, res) {
        //Retrieve the variable from the Query string
        var a = req.query.a,
            b = req.query.b,
            result = 0,
            msg = "";
            
        //Check to make sure that both variables are defined
        if( _.isUndefined(a) || _.isUndefined(b) ) {
            msg = "One of the variables is undefined.";
            
            res.send(msg);
        } else {
            addNumbers();
        }

        function addNumbers() {
            //Check to make sure both are numbers
            if( isNan(a) || isNan(b) ) {
                msg = "One or both variables are not a number. Please enter two Integers!";
                
            } else {
                //Parse the query string variables as integers
                a = parseInt(a);
                b = parseInt(b);
        
            
                //Add the two numbers together
                result = a + b;
        
                msg = "The addition of a(" + a + ") and b(" + b + ") is: " + result;
            }
            
            //Return the following message
            res.send(msg);
        
        }
        
        }); //END GET Addition
};