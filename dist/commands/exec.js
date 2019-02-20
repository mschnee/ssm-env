"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cross_spawn_1 = require("cross-spawn");
const get_params_for_path_array_1 = require("../lib/get-params-for-path-array");
const get_ssm_1 = require("../lib/get-ssm");
const get_parameter_paths_1 = require("../lib/get-parameter-paths");
async function exportEnv(argv, command) {
    const ssm = get_ssm_1.default(argv);
    const paths = get_parameter_paths_1.default(argv);
    if (!paths || !paths.length) {
        console.error('Missing prefix paths');
        return;
    }
    const [resultVarsOverEnv, resultNewVars] = await get_params_for_path_array_1.default(ssm, paths);
    // borrowed from cross-env
    const proc = cross_spawn_1.spawn(command[0], command.slice(1), {
        stdio: 'inherit',
        env: resultVarsOverEnv,
    });
    process.on('SIGTERM', () => proc.kill('SIGTERM'));
    process.on('SIGINT', () => proc.kill('SIGINT'));
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'));
    process.on('SIGHUP', () => proc.kill('SIGHUP'));
    proc.on('exit', (code, signal) => {
        let crossEnvExitCode = code;
        // exit code could be null when OS kills the process(out of memory, etc) or due to node handling it
        // but if the signal is SIGINT the user exited the process so we want exit code 0
        if (crossEnvExitCode === null) {
            crossEnvExitCode = signal === 'SIGINT' ? 0 : 1;
        }
        process.exit(crossEnvExitCode); //eslint-disable-line no-process-exit
    });
    return proc;
}
exports.default = exportEnv;
//# sourceMappingURL=exec.js.map