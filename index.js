"use strict";

const handler = require('./src/Handler');

// lambda entry handler
exports.handler = async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;

    const result = await handler(event);

    if(result.statusCode !== 200) {
        context.fail(JSON.stringify(result));
    }

    return response;

};
