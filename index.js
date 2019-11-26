"use strict";

const handler = require('./src/Handler');

// lambda entry handler
exports.handler = async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;

    const result = await handler(event);

    const statusCode = result.errors ? 500 : 200
    const response = { "statusCode": statusCode, "body": result }
    if(statusCode !== 200) {
        context.fail(JSON.stringify(response));
    }

    return response;

};
