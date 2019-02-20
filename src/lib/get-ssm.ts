import * as AWS from 'aws-sdk';

export default function getSsm(argv) {
    return new AWS.SSM({
        region: argv.awsRegion,
        accessKeyId: argv.awsAccessKeyId,
        secretAccessKey: argv.awsSecredAccessKey,
        endpoint: argv.awsEndpoint || undefined
    });
}