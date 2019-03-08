import * as AWS from 'aws-sdk';

import getParamsForPathArray from '../lib/get-params-for-path-array';
import getSsm from '../lib/get-ssm';
import getPaths from '../lib/get-parameter-paths';

export default async function exportEnv(argv: any) {
    const ssm = getSsm(argv);

    const paths = getPaths(argv);

    if(!paths || !paths.length) {
        console.error('Missing prefix paths');
        return;
    }

    if (argv.verbose) {
        console.log('About to get ssm params', paths);
    }

    const [resultVarsOverEnv, resultNewVars] = await getParamsForPathArray(ssm, paths);

    if (argv.verbose) {
        console.log(resultNewVars);
    }
    const resultVars = argv.newEnv ? resultNewVars : resultVarsOverEnv;
    writeDotenv(resultVars);
}

function writeJson(o: Object) {
    process.stdout.write(JSON.stringify(o, null, 2));
}

function writeDotenv(o: Object) {
    for (let key in o) {
        process.stdout.write(`${key}=${o[key]}\n`);
    }
    process.stdout.write('\n');
}