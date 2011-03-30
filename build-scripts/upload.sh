#!/bin/bash

set -e
. env.sh

##########################################################################################
##
##
## expecting the user to do: ./upload.sh <release number> <pp|pr>
## release number is a variable we need to build into SVN (example, 5_1)
##   so that, for each realease to prod, we assign a release number
##   
## This script will copy the war file and tar file over to the navisite servers.
##
#########################################################################################



if [ $# -ne 2 ]
then
        echo "ERROR - release number is required"
	echo "./upload.sh <release number> <pp|pr>"
	echo "we are expecting to check out ${SVN_APP}<release number>"
	exit 1
fi

if [ "$2" == "pr" ]
then 
    echo "---- copying to PROD ----"
    APP_1=${PR_APP_1}
    APP_2=${PR_APP_2}
    TARGET_SERVER="PRODUCTION"
elif [ "$2" == "pp" ]
then
    APP_1=${PP_APP_1}
    APP_2=${PP_APP_2}
    TARGET_SERVER="PRE-PRODUCTION"
else
    echo "expecting pr|pp for the second input. your input is $2"
    exit 1
fi


echo "clean and recreating target location (${TARGET_LOCATION}/$1_$2)"
echo " -- clean/recreating in ${APP_1}"
ssh ${SCP_USER}@${APP_1} "rm -Rf  ${TARGET_LOCATION}/$1_$2; mkdir  ${TARGET_LOCATION}/$1_$2"
echo " -- clean/recreating in ${APP_2}"
ssh ${SCP_USER}@${APP_2} "rm -Rf  ${TARGET_LOCATION}/$1_$2; mkdir  ${TARGET_LOCATION}/$1_$2"

echo "Copying to ${TARGET_SERVER} 1: ${APP_1}"
scp ${DIR_RELEASE}/$1_$2/* ${SCP_USER}@${APP_1}:${TARGET_LOCATION}/$1_$2/.

echo "Copying to ${TARGET_SERVER} 2: ${APP_2}"
scp ${DIR_RELEASE}/$1_$2/* ${SCP_USER}@${APP_2}:${TARGET_LOCATION}/$1_$2/.

echo "all done - all artifacts shall be inside  ${TARGET_LOCATION}/$1_$2/ folder in target servers"


