# sendgrid-eventkit-lambda-mongodb

[![Open Issues](https://img.shields.io/github/issues/memiah/sendgrid-eventkit-lambda-mongodb.svg)](https://github.com/memiah/sendgrid-eventkit-lambda-mongodb/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [**.iam.md: IAM Policy & Setup**](.iam.md#table-of-contents)
- [**.aws.setup.md: AWS Lambda & API Gateway setup**](.aws.setup.md#table-of-contents)

- [Table of Contents](#table-of-contents)
  - [Motivation ](#motivation)
  - [Local Development via Docker with Mapped volumes](#local-development-via-docker-with-mapped-volumes)
  - [Local Dependancies](#local-dependancies)
  - [Process](#process)
  - [Pending updates](#pending-updates)
  - [Contributing](#contributing)
  - [License](#license)

## Motivation

Provision a Lambda based relay script that will, self test, self deploy and consume SendGrid webhook endpoints and relay them to Mongodb's Atlas cloud service. Also included as part of the microservice is information on how to setup the AWS IAM policies with the least permissive [policy](.iam.md#example-policy) possible.

## Local Dependancies

1. npm
2. Docker (optional but recommended)

## Process

1. Copy .env.example to .env
2. Check DATABASE points to valid MongoDB URI ([mongo setup](#mongo-setup))
3. Install NPM dependancies

```bash
npm install
```

4. Test

```bash
# run test via local docker containers
npm test
# clean up containers
npm run cleanup
```

## Mongo Setup

You can set the DATABASE environment variable to any valid Mongo connection URI.

However, it is recommend you test to a local isolated Mongo instance.

Via provided NPM script:

```bash
npm run setup-mongo
```

Via Docker directly:

```bash
docker run --detach --name sendgrid-mongo --expose 27017 -p 127.0.0.1:27017:27017/tcp mongo
```

To change local port due to any conflicts:

- Update `127.0.0.1:27017` to `127.0.0.1:xxxxx` where `xxxxx` is new port.
- Update .env connection string with new port
- This can be ran manually, or updated in `package.json` for ongoing convenience

## Pending updates

- [x] enforce unique index on sg_message_id
- [x] handle unique key errors in insertMany
- [x] replace vagrant with docker for local development
- [x] add packaged staging with Docker
- [x] improve debug testdata files with unique event ids
- [x] add testing and travis CI
  - [x] test deep nested lambda function handlers (Result: _namespace/component.handler_)
  - [x] setup IAM user for Travis
  - [x] document Travis:IAM process
  - [x] set up travis build file using docker
  - [x] add Lambda deployment to travis (https://docs.travis-ci.com/user/deployment/lambda/)
- [x] document AWS API Gateway setup

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
