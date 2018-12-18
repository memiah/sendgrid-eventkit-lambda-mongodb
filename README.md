# sendgrid-eventkit-lambda-mongodb - [![Build Status](https://travis-ci.org/memiah/sendgrid-eventkit-lambda-mongodb.svg?branch=master)](https://travis-ci.org/memiah/sendgrid-eventkit-lambda-mongodb)

Lambda function using Node.js to accept events from SendGrid and insert into Mongo store.

## Local Development via Docker with Mapped volumes

### Local Dependancies
1. Docker
2. npm

### Process
1. Copy .env.example to .env
2. Update ENVIRONMENT to "development"
3. Change TESTFILE location if desired
4. Install NPM dependancies
```bash
npm install
```

5. Init Docker (add -d for quiet run)
```bash
# foreground run with return data
docker-compose -f .\docker-compose.yml -f .\.docker\docker-compose.dev.yml up

# background run (no visual feedback - check mongo for data)
docker-compose -f .\docker-compose.yml -f .\.docker\docker-compose.dev.yml up
```

- This will run the lambda function with the 'event' argument data overwritten from the TESTFILE json.
- Events are written to MongoDB in container and accessible via Mongo client pointing to mongodb://127.0.0.1:27017/sendgrid

## Pending updates
- [X] enforce unique index on sg_message_id
- [X] handle unique key errors in insertMany
- [X] replace vagrant with docker for local development
- [X] add packaged staging with Docker
- [ ] add AWS Lambda setup guide to README
- [ ] improve debug testdata files with unique event ids
- [ ] add testing and travis CI
    - [X] test deep nested lambda function handlers (Result: _namespace/component.handler_)
    - [X] setup IAM user for Travis
    - [X] document Travis:IAM process
    - [X] set up travis build file using docker
    - [ ] add Lambda deployment to travis (https://docs.travis-ci.com/user/deployment/lambda/)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)