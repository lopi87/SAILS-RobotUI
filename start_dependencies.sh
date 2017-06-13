#!/usr/bin/env bash
unamestr=`uname`

DOCKER_ADDRESS='localhost'

echo "Your Docker address: $DOCKER_ADDRESS";

docker-compose up -d
