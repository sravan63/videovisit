#!/bin/bash

set -e
. env.sh

##########################################################################################
##
##
## expecting the user to do: ./tagCode.sh <name>
## it will automatically generate a tag with <YYYYMMDD-name> 
##
#########################################################################################

if [ -z "$1" ]
then
        echo "ERROR - tag name is required"
	echo "./tagCode.sh <name>"
	echo "we would tag the  ${SVN_TRUNK} to ${SVN_TAGS}/YYYYMMDD-NAME"
	exit 1
fi


TODAY=$(date +"%Y%m%d")


echo "--------------TAG SVN TRUNK TO ${SVN_TAGS}/${TODAY}-$1-----------------------"
svn copy ${SVN_TRUNK} ${SVN_TAGS}/${TODAY}-$1 -m "tag" --username ${SVN_USER}

echo "tagged"
