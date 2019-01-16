
# sendgrid-eventkit-lambda-mongodb
[![Build Status](https://travis-ci.org/memiah/sendgrid-eventkit-lambda-mongodb.svg?branch=master)](https://travis-ci.org/memiah/sendgrid-eventkit-lambda-mongodb)
[![Open Issues](https://img.shields.io/github/issues/memiah/sendgrid-eventkit-lambda-mongodb.svg)](https://github.com/memiah/sendgrid-eventkit-lambda-mongodb/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents
* [**.iam.md: IAM Policy & Setup**](.iam.md#table-of-contents)
* [**.aws.setup.md: AWS Lambda & API Gateway setup**](.aws.setup.md#table-of-contents)

* [Table of Contents](#table-of-contents)
    * [Motivation ](#motivation)
    * [Local Development via Docker with Mapped volumes](#local-development-via-docker-with-mapped-volumes)
    * [Local Dependancies](#local-dependancies)
    * [Process](#process)
    * [Pending updates](#pending-updates)
    * [Contributing](#contributing)
    * [License](#license)

## Motivation 

Provision a Lambda based relay script that will, self test, self deploy and consume SendGrid webhook endpoints and relay them to Mongodb's Atlas cloud service.  Also included as part of the microservice is information on how to setup the AWS IAM policies with the least permissive [policy](.iam.md#example-policy) possible. The service is deployable using the Travis github hooks and will automatically test with local integrations of NodeJS and MongoDB that are stored within the docker containers.


## Local Development via Docker with Mapped volumes
The folder ./.docker folder contains the dev containers as well as the travis production containers. [**.env.example**](#process) must be populated when running in development as per the process below.

### Local Dependancies
1. Docker
2. docker-compose
3. npm

### Process
1. Copy .env.example to .env
2. Update ENVIRONMENT to "development"
3. Change TESTFILE location if desired
4. Install NPM dependancies
```bash
npm install
```

5. Init Docker
```bash
# use docker to run test
docker-compose -f ./docker-compose.yml -f ./.docker/docker-compose.dev.yml up --exit-code-from app
# clean up containers
docker rm -v sendgrid-eventkit-lambda-mongodb-mongo 
```

- This will run the lambda function with the 'event' argument data overwritten from the TESTFILE json.
- docker exits when lambda function returns code (sendgrid_app_1 exited with code ~)
- ~ = 0 = success; 


## Pending updates
- [X] enforce unique index on sg_message_id
- [X] handle unique key errors in insertMany
- [X] replace vagrant with docker for local development
- [X] add packaged staging with Docker
- [X] improve debug testdata files with unique event ids
- [X] add testing and travis CI
    - [X] test deep nested lambda function handlers (Result: _namespace/component.handler_)
    - [X] setup IAM user for Travis
    - [X] document Travis:IAM process
    - [X] set up travis build file using docker
    - [X] add Lambda deployment to travis (https://docs.travis-ci.com/user/deployment/lambda/)
- [ ] document AWS API Gateway setup

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)