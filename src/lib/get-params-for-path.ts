import * as AWS from 'aws-sdk';

import describeAllParameters from '../lib/describe-all-parameters';
import getParameterValues from '../lib/get-parameter-values';

export default async function getParamsForPath(ssm: AWS.SSM, path: string) {
    const requested = await describeAllParameters(ssm, [
        {
            Key: 'Name',
            Option: 'BeginsWith',
            Values: [path]
        }
    ]);

    const names = requested.map(r => r.Name);

    return getParameterValues(ssm, names);
}