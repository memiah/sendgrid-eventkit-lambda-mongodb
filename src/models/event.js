const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    "email": string
    "timestamp": number
    "event": string
    "smtp-id": string
    "useragent": string
    "IP": string
    "sg_event_id": string
    "sg_message_id": string
    "reason": string
    "status": string
    "response": string
    "tls": string
    "url": string
    "attempt": numbet
    "category": string
    "asm_group_id": number
    //"unique_args or custom_args": string
    "marketing_campaign_id": number
    "marketing_campaign_name": string
  },
  { collection: 'events' },
);

module.exports = schema;
