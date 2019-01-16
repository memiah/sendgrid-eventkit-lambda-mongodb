const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    "email": String,
    "timestamp": { type: Number, index: true},
    "event": { type: String, index: true},
    "smtp-id": String,
    "sg_event_id": { type: String, unique: true },
    "sg_message_id": String,
    "reason": String,
    "status": String,
    "response": String,
    "category": String,
    "site_name": String,
    "ip": String,
    "info": new Schema({}, {strict: false}), 
    "member": new Schema({
      "id": { type: Number, default: 0, index: true },
      "email_type": String,
      "contacted": { type: Number, default: 0 },
      "resolved": { type: Number, default: 0, index: true},
      "resolved_timestamp": Number
    })
  },
  { collection: process.env.COLLECTION },
);

module.exports = schema;
