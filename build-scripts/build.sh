#!/bin/bash
set -e

. env.sh

if [ -z "$1" ]
then
        echo "ERROR - environment variable is required"
        echo "./build.sh <qa|pp|pr>"
        echo "have to be one of the 3 values"
        exit 1
fi

echo "copy override files over"
cp -Rf override/build.properties.$1 $DIR_APP/build.properties 
cp -Rf override/local.$1 $DIR_APP/conf/filters/local

cd $DIR_APP
ant -propertyfile build.properties generateWar
cd -

