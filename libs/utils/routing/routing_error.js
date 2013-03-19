/**
 * Created with JetBrains WebStorm.
 * Date: 2013-03-19
 * Time: 10:57 AM
 * @author Adam C. Nowak
 * @description
 */

"use strict";

var RoutingError = {
    error : function(req, res, status, msg, err) {
        //respond with html page
        if(req.accepts('html')) {
            res.status(status);
            //res.send(status, msg);
            res.send(status, {url: req.url});
            //Used if you want to render an HTML Error page
            //res.render(status, {url: req.url});
            return;
        }
        //respond with json
        if(req.accepts('json')){
            res.status(status);
            res.send({error: msg});
            return;
        }
        //default to plain-text. send()
        else {
            res.type('txt');
            res.status(status);
            res.send(msg);
            return;
        }
    }
};
module.exports = RoutingError;