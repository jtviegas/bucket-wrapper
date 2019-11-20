#!/bin/sh
__r=0
this_folder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ -z $this_folder ]; then
    this_folder=$(dirname $(readlink -f $0))
fi
echo "this_folder: $this_folder"

parent_folder=$(dirname $this_folder)

AWS_REGION=eu-west-1
AWS_CLI_OUTPUT_FORMAT=text

# shellcheck disable=SC2006
_pwd=`pwd`
# shellcheck disable=SC2164
cd "$this_folder"

curl -XGET https://raw.githubusercontent.com/jtviegas/script-utils/master/bash/aws.sh -o "${this_folder}"/aws.sh
. "${this_folder}"/aws.sh

aws_init $AWS_REGION $AWS_CLI_OUTPUT_FORMAT


BUCKET="bucket-wrapper-test"
BUCKET_FOLDER="test"
AWS_CONTAINER="http://localhost:5000"
CONTAINER=s3

echo "starting bucket-wrapper tests..."

echo "...starting aws mock container..."
docker run --name $CONTAINER -d -e SERVICES=s3:5000 -e DEFAULT_REGION=eu-west-1 -p 5000:5000 localstack/localstack

createBucket ${BUCKET} ${AWS_CONTAINER}
__r=$?
# shellcheck disable=SC2154
if [ ! "$__r" -eq "0" ] ; then cd "${_pwd}" && exit 1; fi

debug "...adding folder $BUCKET_FOLDER to bucket ${BUCKET} ..."
createFolderInBucket ${BUCKET} ${BUCKET_FOLDER} ${AWS_CONTAINER}
__r=$?
if [ ! "$__r" -eq "0" ] ; then cd "${_pwd}" && exit 1; fi
info "...added folder $BUCKET_FOLDER to bucket $BUCKET..."
export BUCKETWRAPPER_TEST_ENDPOINT="$AWS_CONTAINER"
node_modules/nyc/bin/nyc.js node_modules/mocha/bin/_mocha -- -R spec test/*
__r=$?

echo "...stopping aws mock container..."
docker stop $CONTAINER && docker rm $CONTAINER
rm "${this_folder}"/aws.sh

cd "${_pwd}"
echo "...bucket-wrapper test done. [$__r]"




