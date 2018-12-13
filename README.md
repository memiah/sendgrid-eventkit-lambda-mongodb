# sendgrid-eventkit-lambda-mongodb

Lambda function using Node.js to accept events from SendGrid and insert into Mongo store.

## Setup

Local setup using vagrant

```bash
vagrant up
```

Local setup using Ubuntu
```bash
# install mongodb repos
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
# install mongo db
sudo apt-get install -y mongodb-org
# install nodejs
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs 
# install lambda-local for local testing
sudo npm install -gy lambda-local
```

## Testing

### Test using lambda-local on ubuntu
```bash
lambda-local -l ./index.js -e ./tests/events.json -E {\"DATABASE\":\"mongodb://localhost:27017/evie\"}
```

### Test using lambda-local on Powershell
```bash
lambda-local -l ./index.js -e ./tests/events.json -E '{\"DATABASE\":\"mongodb://localhost:27017/evie\"}'
```

## Pending updates
1. enforce unique index on sg_message_id
2. handle unique key errors in insertMany
3. replace vagrant with docker/ansible
4. add AWS Lambda setup guide to README
5. add testing and travis CI

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)