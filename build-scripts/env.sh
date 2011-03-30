#!/bin/bash

SVN_TRUNK="http://ttg-svn.har.ca.kp.org:9990/svn/videovisit/member-facing/TRUNK"
SVN_RELEASES="http://ttg-svn.har.ca.kp.org:9990/svn/videovisit/member-facing/releases"
SVN_TAGS="http://ttg-svn.har.ca.kp.org:9990/svn/videovisit/member-facing/TAGS"
SVN_ESB_TOOLS="http://ttg-svn.har.ca.kp.org:9990/svn/esb/buildtools/esb-client-tools/trunk"
SVN_USER=melvin.ma
SVN_APP_NAME="videovisit-member-webapp"


DIR_BUILD_ROOT=build-app
DIR_APP=${DIR_BUILD_ROOT}/vvm
DIR_ESB_TOOLS=${DIR_BUILD_ROOT}/esb-client-tools

DIR_APP_WEBCONTENT=${DIR_APP}/docroot

DIR_RELEASE=dist

BUILD_WAR_PATH=${DIR_APP}/build/war/videovisitmember.war
WAR_NAME=videovisit.war

##pp-app-vdo-1/2
PP_APP_1="172.25.125.108"
PP_APP_2="172.25.125.109"

## pr-app-vdo-1/2
PR_APP_1="172.25.125.74"
PR_APP_2="172.25.125.75"

## TARGET SERVER:
SCP_USER=W466589
TARGET_LOCATION="/extra/ttg.workspace/videovisit-member"



