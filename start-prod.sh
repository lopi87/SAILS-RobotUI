#!/usr/bin/env bash

DOCKER_ADDRESS='localhost'

echo "Your Docker address: $DOCKER_ADDRESS";

MONGO_PORT_27017_TCP_ADDR=$DOCKER_ADDRESS \
MONGO_PORT_27017_TCP_PORT=27017 \
NODE_ENV=production \
node app.js --prod
