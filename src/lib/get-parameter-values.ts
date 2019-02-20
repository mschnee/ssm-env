import * as AWS from 'aws-sdk';

export default async function getParameterValues(ssm: AWS.SSM, names: string[]): Promise<AWS.SSM.Parameter[]> {
    let results: AWS.SSM.Parameter[] = [];
    for (let i = 0; i < names.length; i += 10) {
        const response = await ssm.getParameters({
            Names: names.slice(i, i+10),
            WithDecryption: true,
        }).promise();

        results = results.concat(response.Parameters);
    }

    return results;
}