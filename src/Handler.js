'use strict';

const mongoose = require('mongoose');
const defaults = require('./const/defaults');
const AWS = require('aws-sdk');

// DATABASE mongo URI should be set in env
const uri = process.env.DATABASE || defaults.MONGO_DEFAULT_URI;

// scope dbconnection globally for re-use by different requests
let dbConnection = null;

// lambda entry handler
const handler = async (event, context) => {
  let time;
  const logTime = (msg) => {
    if (msg) {
      const diff = new Date().getTime() - time;
      console.log(`${msg}: ${diff}ms`);
    }
    time = new Date().getTime();
  };

  // if database connection not active, create it in global scope
  if (dbConnection == null) {
    logTime();
    try {
      dbConnection = await mongoose.createConnection(uri, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      const response = { statusCode: 500, body: err };
      return response;
    }

    // create model and attach to global database connection
    const eventSchema = require('./models/event');
    dbConnection.model('Event', eventSchema);

    logTime('DB Connection Setup');
  }

  //swap out event for test file when in dev
  if (process.env.TESTFILE) {
    event = require(process.env.TESTFILE);
  }

  const query = event.params.querystring;
  const site_name = query.s || '';
  event = event['body-json'];

  const eventModel = dbConnection.model('Event');

  // get event data from gateway passthrough
  let eventData = event;

  console.log('Events received: ', eventData.length);

  logTime();
  // if event data is a string, parse it
  if (typeof eventData == 'string') {
    eventData = JSON.parse(eventData);
  }

  // separate unpacked fields and put everything else in eventData embedded data
  try {
    const handledFields = Object.keys(eventModel.schema.obj);
    eventData = eventData.map((event) => {
      let mappedEvent = { site_name: site_name, info: {}, member: {} };
      Object.keys(event).forEach((key) => {
        if (handledFields.indexOf(key) > -1) {
          mappedEvent[key] = event[key];
        } else {
          mappedEvent.info[key] = event[key];
        }
      });
      return mappedEvent;
    });
  } catch (err) {
    return { statusCode: 500, body: err };
  }

  logTime('Prepare Data');

  // initialise return result
  const result = { received: eventData.length, dupes: 0, errors: 0, affected: 0 };

  // if category is array, replace with first element (sendgrid changed data format but we only want a string )
  eventData = eventData.map((e) => {
    return { ...e, category: Array.isArray(e.category) ? e.category[0] : e.category };
  });

  logTime();
  await new Promise((resolve) => {
    // insert records
    eventModel.insertMany(eventData, { ordered: false }, (error, docs) => {
      // count dupes and non-dupe errors
      result.affected = (docs && docs.length) || 0;
      if (error) {
        console.log('MongoDB Error', error);
        if (error.writeErrors) {
          result.dupes = error.writeErrors.filter((error) => error.err.code == 11000).length;
          result.errors = error.writeErrors.length - result.dupes;
        }
      }
      resolve(true);
    });
  });

  logTime('Database Inserts', result);

  const statusCode = result.errors || !result.affected ? 500 : 200;

  var sqsMessageId = '';
  if (statusCode == 500 && process.env.SQS_REDRIVE_QUEUE) {
    const sqs = new AWS.SQS({ region: process.env.SQS_REDRIVE_QUEUE.split('.')[1] });
    sqsMessageId = await new Promise((resolve) => {
      const params = {
        QueueUrl: process.env.SQS_REDRIVE_QUEUE,
        MessageBody: JSON.stringify(eventData),
      };
      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log('Erroring sending to sqs', err);
          console.log('EventData', eventData);
          resolve(false);
        }
        if (data) {
          resolve(data.MessageId);
        }
      });
    });
  }

  if (result.errors > 0) {
    console.error('errorsFoundInData', { sqsMessageId, result });
  }

  if (result.dupes > 0) {
    console.warn('dupesFoundInData', { sqsMessageId, result });
  }

  if (result.affected == 0) {
    console.error('noAffectedRows', { sqsMessageId, result });
  }

  return { statusCode: statusCode, body: result };
};

module.exports = handler;
