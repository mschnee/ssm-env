import * as AWS from 'aws-sdk';

import getParamsForPath from './get-params-for-path';

export default async function getParamsForPathArray(ssm: AWS.SSM, paths: string[]) {
    const varsOverEnv = process.env;
    const newVarsOnly = {};

    return paths.reduce((pr, path) => pr.then(async ([allVars, newVars])=> {
        const params = await getParamsForPath(ssm, path);

        params.forEach(p => {
            const name = p.Name.split('/').pop().toUpperCase();
            if (!newVars.hasOwnProperty(name)) {
                newVars[name] = p.Value;
            }
            if (!allVars.hasOwnProperty(name)) {
                allVars[name] = p.Value;
            }
        });
        return [allVars, newVars];
    }),Promise.resolve([varsOverEnv, newVarsOnly]));
}