import { spawn } from 'cross-spawn';
import * as AWS from 'aws-sdk';

import getParamsForPathArray from '../lib/get-params-for-path-array';
import getSsm from '../lib/get-ssm';
import getPaths from '../lib/get-parameter-paths';

export default async function exportEnv(argv: any, command: string[]) {
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
    // borrowed from cross-env
    const proc = spawn(command[0], command.slice(1),{
            stdio: 'inherit',
            env: resultVarsOverEnv,
        },
    );
    process.on('SIGTERM', () => proc.kill('SIGTERM'));
    process.on('SIGINT', () => proc.kill('SIGINT'));
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'));
    process.on('SIGHUP', () => proc.kill('SIGHUP'));

    proc.on('exit', (code, signal) => {
        let crossEnvExitCode = code;
        if (crossEnvExitCode === null) {
            crossEnvExitCode = signal === 'SIGINT' ? 0 : 1;
        }
        process.exit(crossEnvExitCode);
    });

    return proc;
}