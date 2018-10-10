#!/bin/bash

# For each directory under integration-test/, installs the current project into
# their node_modules directory, and then runs the index.js file.
#
# Fails on a failure of any command.

set -e

export PACKAGE_NAME=web-contract-types

rm -f "$PACKAGE_NAME"-*.tgz
npm pack

for testdir in integration-test/*; do
    echo Running "$testdir"
    if [ -e "$testdir"/package.json ]; then
        pushd "$testdir" >& /dev/null

        rm -rf node_modules
        mkdir node_modules

        pushd node_modules >& /dev/null
        tar xfz ../../../"$PACKAGE_NAME"-*.tgz
        mv package "$PACKAGE_NAME"
        popd >& /dev/null

        popd >& /dev/null
        echo Installed

        "$testdir"/index.js
    fi
    echo Pass "$testdir"
done
