"use strict";

const mongoose = require("mongoose");
// DATABASE mongo URI should be set via Lambda env
const uri = process.env.DATABASE;
// scope dbconnection globally
let dbConnection = null;

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

    // get event data from gateway passthrough
    let eventData = event.body; 

    // if event data is a string, parse it
    if(typeof eventData == "string") {
        eventData = JSON.parse(eventData);
    }

    const eventModel = dbConnection.model('Event'); 
    const res = await eventModel.insertMany(eventData);

    return { "statusCode": 200, "body": { "inserted": res.length }};

};
