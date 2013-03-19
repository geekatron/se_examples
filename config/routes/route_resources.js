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
        var val = {'configuration' : dex};
        res.send(val);
    });

    /**
     * Route dealing with authorizing the service for use with the
     * 3rd party report system.
     */
    app.post('/analytics/reports/login', function(req, res) {
        //Log the service into the Report Server
        var auth = new authorization(undefined),
            server = dex.reportserver;

        auth.login(server.username, server.password, handleAuth);

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

    /**
     * Route dealing with the listing of reports.
     */
    app.get('/analytics/reports', function(req, res) {
        //Extract the necessary query parameters
        //Retrieve the Session Id
        var sid = req.query.sid,
        //Retrieve the User's Organization
            org = req.query.org,
        //Retrieve the User's Role
            role = req.query.role;

        var report = new reportList(sid, org, role);
        //Retrieve a list of reports
        report.list(handleReportsList);

        function handleReportsList(err, data) {
            //Error - handle error response
            if( !_.isUndefined(err) ) {
                error.error(req, res, err.statuscode, err.message);
//                res.send(err.statuscode, err.message);
            } else {
                //Print out the session id as debug
                console.log("Session id from report server: " + data );

                var reportList =
                {
                    kind : 'ice-m#reportList',
                    organization : org,
                    role : role,
                    reports : data
                };

                res.send(reportList);
            }
        }//END handleReportsList

    });

    /**
     * Route to deal with the retrieval of the specified report
     */
    app.get('/analytics/reports/:name', function(req, res) {
        var reportname = req.params.name;
        //Extract the necessary query parameters
        //Retrieve the Session Id
        var sid = req.query.sid,
        //Retrieve the User's Organization
            org = req.query.org,
        //Retrieve the User's Role
            role = req.query.role,
        //Retrieve the User's Role
            page = req.query.page;

        var r = new report(sid, org, role, reportname, page);
        //Retrieve a list of reports
        r.get(handleReport);

        function handleReport(err, data) {
            //Error - handle error response
            if( !_.isUndefined(err) ) {
                error.error(req, res, err.statuscode, err.message);
//                res.send(err.statuscode, err.message);
            } else {
                var reportData =
                {
                    kind : 'ice-m#report',
                    organization : org,
                    role : role,
                    name : reportname,
                    data : encodeURIComponent(data)
                };

                res.send(reportData);
            }
        }//END handleReportsList
    });

    /**
     * Route dealing with proxying the image reports.
     */

    app.get('/analytics/reports/proxy/:sessionid/*', function(req, res) {

        //Retrieve the Session Id
        var rs = dex.reportserver,
            sid = req.params.sessionid,
            cookie = dex.cache.session[sid];

        //Extract the URL for the resource on the Report Server
        var split_str = rs.prefix + '/' + sid, split_url;
        split_url = req.url.split(split_str);

        //Modify the request with the required data
        //Add the Jasper Pro resource to the proxy URL
        req.url = split_url[1];
        //Set the cookie header
        req.headers["Cookie"] = cookie;

        //req.headers["Content-Type"] = "image/png";

        //Create the Routing Proxy
        var proxy = new (httpProxy.RoutingProxy)();

        proxy.on('end', function(req,res) {
            console.log('Proxy response: '+res.body);

            if( res.statusCode != 200 ) {
                console.log('RES Status Code: ' + res.statusCode + ' MSG Body: ' + res.body + ' Headers: ' + JSON.stringify(res.headers) );
            }

        });

        proxy.on('proxyError', function (err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });

            console.log('Proxy error: ' +err);

            res.end('Something went wrong. And we are reporting a custom error message:'+err.message);
        });

        //Proxy the request
        proxy.proxyRequest(req, res, {
                host : 'jasperpro.dexit.co',
                port : 8080,
                enable :
                {
                    xforward : false
                },
                changeOrigin : true

            }
        );

    });

};