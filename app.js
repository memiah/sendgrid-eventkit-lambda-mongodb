require('dotenv').config();

const handler = require('./src/Handler');
const event = require(`./testdata/${process.env.TESTFILE}`);

handler(event).then((response) => {
  console.log('response', response);
  process.exit();
});
