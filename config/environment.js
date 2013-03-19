/**
 * Created with JetBrains WebStorm.
 * Date: 2013-03-19
 * Time: 10:47 AM
 * @author Adam C. Nowak
 * @description
 */

var crs = require("connect-restreamer");

module.exports = function (app, express){
    app.configure(function() {
        app.use(express.bodyParser());
        app.use(express.logger());
    });

    prd = {};
    prd.log = {};
    prd.log.output = false;
    prd.log = function(msg) {
        if( prd.log.output ) {
            console.log(msg);
        }
    };

    //Namespace to cache the session id/cookie
    prd.cache = {};
    prd.cache.session = {};

    app.configure('dev', function() {
        app.use(express.bodyParser());
        //Connect Re-streamer re-emitting the body to the proxy
        //app.use(crs()); //Does not seem to be necessary with new Node/Express

        app.use(express.errorHandler({
            dumpExceptions : true,
            showStack : true
        }));


        //ICE-M Address
        prd["address"] = 'http://example.com/';
//        prd["address"] = 'http://127.0.0.1:5050/';
    });

};
