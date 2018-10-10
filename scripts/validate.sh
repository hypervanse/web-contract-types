#!/bin/bash

set -e

npm run lint
npm test
npm run integrationtest
