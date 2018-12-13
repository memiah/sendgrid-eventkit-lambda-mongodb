const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    "email": String,
    "timestamp": Number,
    "event": String,
    "smtp-id": String,
    "useragent": String,
    "ip": String,
    "sg_event_id": String,
    "sg_message_id": { type: String, unique: true},
    "reason": String,
    "status": String,
    "response": String,
    "tls": String,
    "url": String,
    "attempt": Number,
    "category": String,
    "asm_group_id": Number,
    "marketing_campaign_id": Number,
    "marketing_campaign_name": String
  },
  { collection: 'events' },
);

module.exports = schema;
