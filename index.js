"use strict";

const mongoose = require("mongoose");
const request = require('request-promise');

// DATABASE mongo URI should be set via Lambda env
const uri = process.env.DATABASE;
// scope dbconnection globally
let dbConnection = null;

// lambda entry handler
exports.handler = async function(event, context) {

    context.callbackWaitsForEmptyEventLoop = false;

    // if database connection not active, create it in global scope
    if (dbConnection == null) {
        dbConnection = await mongoose.createConnection(uri, {
          bufferCommands: false,
          bufferMaxEntries: 0,
          useNewUrlParser: true,
          useCreateIndex: true
        });
        // create model and attach to global database connection 
        const eventSchema = require('./models/event');
        dbConnection.model('Event', eventSchema);
    }

    //swap out event for test file when in dev
    if(process.env.TESTFILE) {
        event = require(process.env.TESTFILE);
    }

    const query = event.params.querystring;
    event = event['body-json'];

    if(process.env.LEGACY_WEBHOOK_URI) {
        const webhookUri = process.env.LEGACY_WEBHOOK_URI + '?s=' + query.s;

        console.log('webhookUri', webhookUri);

        // pull webhook uri from environment
        const options = {
            method: 'POST',
            uri: webhookUri,
            body: event,
            json: true
        };

        await request(options);
    }

    const eventModel = dbConnection.model('Event'); 

    // get event data from gateway passthrough
    let eventData = event; 

    // if event data is a string, parse it
    if(typeof eventData == "string") {
        eventData = JSON.parse(eventData);
    }

    // separate unpacked fields and put everything else in eventData embedded data
    const handledFields = Object.keys(eventModel.schema.obj);
    eventData = eventData.map(event => {
        let mappedEvent = { 'info': {} };
        Object.keys(event).forEach(key => {
        if (handledFields.indexOf(key) > -1) {
            mappedEvent[key] = event[key];
        } else {
            mappedEvent.info[key] = event[key];
        }
        });
        //mappedEvent.eventData = JSON.stringify(mappedEvent.eventData);
        return mappedEvent;
    });


    // initialise return result
    const result = { received: eventData.length, dupes: 0, errors: 0 };

    await new Promise((resolve, reject) => {
        // insert records
        eventModel.insertMany(eventData, { ordered: false }, (error) => { 
            // count dupes and non-dupe errors
            if(error && error.writeErrors) {
                result.dupes = error.writeErrors.filter( error => error.err.code == 11000 ).length;
                result.errors = error.writeErrors.length - result.dupes;
            }
            resolve(true);
        });
    });

    if(result.errors > 0) {
        console.error('errorsFoundInData', { allEventData: eventData, insertResult: result });
    }

    if(result.dupes > 0) {
        console.warn('dupesFoundInData', { allEventData: eventData, insertResult: result });
    }

    const statusCode = result.errors ? 500 : 200
    const response = { "statusCode": statusCode, "body": result }
    if(statusCode !== 200) {
        context.fail(JSON.stringify(response));
    }

    return response;

};
