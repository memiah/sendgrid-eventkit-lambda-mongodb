const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    "email": String,
    "timestamp": Number,
    "event": String,
    "smtp-id": String,
    "useragent": String,
    "IP": String,
    "sg_event_id": String,
    "sg_message_id": String,
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
