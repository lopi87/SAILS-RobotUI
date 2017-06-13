#!/usr/bin/env bash

unamestr=`uname`

DOCKER_ADDRESS='localhost'

echo "Your Docker address: $DOCKER_ADDRESS";

MONGO_PORT_27017_TCP_ADDR=$DOCKER_ADDRESS \
MONGO_PORT_27017_TCP_PORT=27017 \
node app.js
