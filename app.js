require('dotenv').config();

const handler = require('./src/Handler');
const event = require('./testdata/events.real.json');

handler(event).then(response => {
  console.log('response', response);
  process.exit();
});
