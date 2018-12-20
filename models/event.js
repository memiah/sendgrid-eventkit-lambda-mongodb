const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    "email": String,
    "timestamp": Number,
    "event": String,
    "smtp-id": String,
    "sg_event_id": { type: String, unique: true },
    "sg_message_id": String,
    "reason": String,
    "status": String,
    "response": String,
    "category": String,
    "ip": String,
    "info": new Schema({}, {strict: false})  
  },
  { collection: 'events' },
);

module.exports = schema;
