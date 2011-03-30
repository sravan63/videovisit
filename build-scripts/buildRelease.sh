#!/bin/bash

set -e
. env.sh

##########################################################################################
##
##
## expecting the user to do: ./buildRelease.sh <release number> <qa|pp|pr>
## release number is a variable we need to build into SVN (example, 5_1)
##   so that, for each realease to prod, we assign a release number
##   in the final build, you could see the checkout number in checkoutVersion file under WAR
##                 or checkoutRelease file under WAR
##
#########################################################################################



if [ $# -ne 2 ]
then
        echo "ERROR - release number is required"
	echo "./buildRelease.sh <release number> <qa|pp|pr>"
	echo "we are expecting to check out ${SVN_APP}<release number>"
	exit 1
fi

echo "checking out release $1 and for env $2"
./checkoutRelease.sh $1
./build.sh $2

echo "check out and build is done - "
echo "now start to copy to distribute folder ${DIR_RELEASE}/<release number>_<env variable> in this case ${DIR_RELEASE}/$1_$2"

if [ -e "${DIR_RELEASE}/$1_$2" ]
then 
    echo "${DIR_RELEASE}/$1_$2 existing. Clean up"
    rm -Rf ${DIR_RELEASE}/$1_$2/*
else
    echo "${DIR_RELEASE}/$1_$2 NOT existing. create one"
    mkdir ${DIR_RELEASE}/$1_$2
fi

echo "copy WAR file over"
cp ${BUILD_WAR_PATH} ${DIR_RELEASE}/$1_$2/${WAR_NAME}


echo "all done - all artifacts shall be inside  ${DIR_RELEASE}/$1_$2 folder"


