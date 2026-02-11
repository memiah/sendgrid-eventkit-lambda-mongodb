"use strict";

const handler = require("./src/Handler");

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const result = await handler(event);

    console.log("sending result", result);

    return result;
};
