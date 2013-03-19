/**
 * Created with JetBrains WebStorm.
 * Date: 2013-03-19
 * Time: 10:58 AM
 * @author Adam C. Nowak
 * @description
 */


"use strict";

var routing_error = require('../../../libs/utils/routing/routing_error');

//Include npm modules
var _ = require("underscore");

var RoutingValidation = {

    //Verify the necessary header parameters for GET, PUT, POST, DELETE Requests
    verifyGETRequest : function (req, res) {
        var routingError = Object.create(routing_error);
        //11.12.2012 - Removed in-order to allow status monitoring (doesn't specity accept)
//        if (_.isEqual(req.headers.accept, "Application/json") || _.isEqual(req.headers.accept, "application/json")) {
        return true;
//        } else {
//            routingError.error(req, res, 406, "Error with header (accept). Expecting application/json .")
//        }
    },
    verifyPUTRequest : function (req, res) {
        var routingError = Object.create(routing_error);
        var accepted = false;
        //Check to see if Accept is specified as application/json
        //if(req.headers.accept == "Application/json" || req.headers.accept == "application/json")
        if(req.accepts('json'))
            accepted = true;
        else
            routingError.error(req, res, 406, "Error with header (accept). Expecting application/json .")
        //Check to see if the Content-type is specified as application/json
//        if(accepted && req.get('content-type').toLowerCase() == "application/json")
//        var ctype = req.get('content-type');
        var ctype = req.headers['content-type'];
        if(!_.isUndefined(ctype)) {
            if( accepted && (ctype.toLowerCase() == "application/json" || ctype.toLowerCase() == "application/json; charset=utf-8") )
                return true;
            else
                routingError.error(req, res, 415, "Error with header (media type). Expecting application/json .")
        } else {
            return true;
        }
    },
    verifyPOSTRequest : function (req, res) {
        var routingError = Object.create(routing_error);
        var accepted = false;
        //Check to see if Accept is specified as application/json
        //if(req.headers.accept == "Application/json" || req.headers.accept == "application/json")
        if(req.accepts('json'))
            accepted = true;
        else
            routingError.error(req, res, 406, "Error with header (accept). Expecting application/json .")
        //Check to see if the Content-type is specified as application/json
        // if(accepted && req.get('content-type').toLowerCase() == "application/json")
        //var ctype = req.get('content-type');
        var ctype = req.headers['content-type'];
        if(!_.isUndefined(ctype)) {
            //if(accepted && (ctype.toLowerCase() == "application/json" || ctype.toLowerCase() == "application/json; charset=utf-8") )
            if( accepted && (ctype.toLowerCase() == "application/json" || ctype.toLowerCase() == "application/json; charset=utf-8") )
                return true;
            else
                routingError.error(req, res, 415, "Error with header (media type). Expecting application/json .")
        } else {
            return true;
        }
    },
    verifyDELETERequest : function (req, res) {
        var routingError = Object.create(routing_error);
        //Check to see if Accept is specified as application/json
        //if(req.headers.accept == "Application/json" || req.headers.accept == "application/json")
        //11.12.2012 - Removed in-order to allow status monitoring (doesn't specity accept)
        if(req.accepts('json'))
            return true;
        else
            routingError.error(req, res, 406, "Error with header (accept). Expecting application/json .")
    },

    /**
     * Validate the message body JSON in-order to see if the required arguments are
     * passed in.
     * @param args - Arguments required in-order to execute function
     * @param callback - Function to execution on completion. Nothing returned on success,
     *                      error otherwise.
     */
    validateMessageBodyArguments : function (args, callback) {
        var requiredArgs = _.keys(args.concept.property),
            passedArgs = _.keys(args.msgbody),
            missing = [],
            valid = true,
            routingError = Object.create(routing_error);

        _.each( requiredArgs , function(value, key) {
            //var picked = _.pick(passedArgs, key);
            var picked = passedArgs[key];

            if(_.isUndefined(picked)) {
                valid = false;
                missing.push(value);
            }
        });

        if( valid ) {
            //All Arguments are present - continue
            callback(undefined);
        } else {
            routingError.error(args.req, args.res, 400, "The following arguments are missing: " + missing.toString() + "!");
        }
    }  //END validateMessageBodyArguments

};
module.exports=RoutingValidation;
