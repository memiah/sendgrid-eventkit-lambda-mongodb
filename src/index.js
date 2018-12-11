"use strict";

const mongoose = require("mongoose");
// DATABASE mongo URI should be set via Lambda env
const uri = process.env.DATABASE;
// scope dbconnection globally
let dbConnection = null;
const eventtypes = require("_eventtypes.js");

// lambda entry handler
exports.handler = async function(event, context) {

    context.callbackWaitsForEmptyEventLoop = false;

    // if database connection not active, create it
    if (dbConnection == null) {
        dbConnection = await mongoose.createConnection(uri, {
          bufferCommands: false,
          bufferMaxEntries: 0,
          useNewUrlParser: true
        });
        // create model and attach to global database connection 
        const eventSchema = require('./models/event');
        dbConnection.model('Event', eventSchema);
    }
    
    // pull
    let eventData = event.body; 
    if(eventData typeof "string") {
        eventData = JSON.parse(eventData);
    }

    eventShape = eventTypes.filter((item) => item.event == eventData.event, this);

    const eventModel = dbConnection.model('event'); 
    await eventModel.create(eventData);

    return { "statusCode": 200, "body": true };

};
