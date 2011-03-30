#!/bin/bash

set -e
. env.sh

##########################################################################################
##
##
## expecting the user to do: ./checkoutRelease.sh <release number>
## release number is a variable we need to build into SVN (example, 5_1)
##   so that, for each realease to prod, we assign a release number
##   in the final build, you could see the checkout number in checkoutVersion file under WAR
##                 or checkoutRelease file under WAR
##
#########################################################################################

if [ -z "$1" ]
then
        echo "ERROR - release number is required"
	echo "./checkoutRelease.sh <release number>"
	echo "we are expecting to check out ${SVN_RELEASES}/<release number>/${SVN_APP_NAME}"
	exit 1
fi



rm -Rf ${DIR_BUILD_ROOT}
mkdir ${DIR_BUILD_ROOT}
mkdir ${DIR_APP}
mkdir ${DIR_ESB_TOOLS}

echo "--------------checking out video visit member project-----------------------"
svn co --username=${SVN_USER} "${SVN_RELEASES}/$1/${SVN_APP_NAME}" ${DIR_APP}/.

echo "inserting version/release information for the build"
cd ${DIR_APP_WEBCONTENT}
version=`svnversion`
echo "svn_version=${version}" >> checkoutVersion
echo "release=$1" >> checkoutRelease
cd -



echo "--------------checking out esb-client-tools project-----------------------"
svn co --username=${SVN_USER} "${SVN_ESB_TOOLS}" ${DIR_ESB_TOOLS}/.

echo "all checked out and version/release information is inserted into the webapp"
