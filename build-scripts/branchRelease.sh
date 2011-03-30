#!/bin/bash

set -e
. env.sh

##########################################################################################
##
##
## expecting the user to do: ./branchRelease.sh <release number>
## it will automatically generate a tag with <YYYYMMDD-name> 
##
#########################################################################################

if [ -z "$1" ]
then
        echo "ERROR - <release number> is required"
	echo "./branchRelease.sh <release number>"
	echo "we would tag the  ${SVN_TRUNK} to ${SVN_SVN_RELEASES}/<release number>"
	exit 1
fi


TODAY=$(date +"%Y%m%d")
echo "--------------TAG SVN TRUNK TO ${SVN_TAGS}/${TODAY}-$1-----------------------"

set +e
  svn ls ${SVN_TAGS}/${TODAY}-$1 --username ${SVN_USER}
  error=$?
  echo ${error}
  if [ $error -ne 0 ]; then
     echo "tag not existing... good"
  else
     echo "tag existing.. delete existing tag"
     svn delete ${SVN_TAGS}/${TODAY}-$1 --username ${SVN_USER} -m "delete to make room for the new one"
  fi
set -e

svn copy ${SVN_TRUNK} ${SVN_TAGS}/${TODAY}-$1 -m "tag" --username ${SVN_USER}
echo "------------- DONE TAGGING"


echo "-------------- REMOVE EXISTING BRANCH-------------------"
set +e
  svn ls ${SVN_RELEASES}/$1 --username ${SVN_USER}
  error2=$?
  if [ $error2 -ne 0 ]; then
    echo "rlease not existing .. good"
  else
    echo "release existing ... delete existing"
    svn delete ${SVN_RELEASES}/$1 --username ${SVN_USER} -m "delete to make room for the new one"
  fi
set -e

echo "--------------TAG SVN TRUNK TO ${SVN_RELEASES}/$1-----------------------"
svn copy ${SVN_TRUNK} ${SVN_RELEASES}/$1 -m "branched at ${TODAY}" --username ${SVN_USER}

echo "DONE"
