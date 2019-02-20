"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_params_for_path_array_1 = require("../lib/get-params-for-path-array");
const get_ssm_1 = require("../lib/get-ssm");
const get_parameter_paths_1 = require("../lib/get-parameter-paths");
async function exportEnv(argv) {
    const ssm = get_ssm_1.default(argv);
    const paths = get_parameter_paths_1.default(argv);
    if (!paths || !paths.length) {
        console.error('Missing prefix paths');
        return;
    }
    const [resultVarsOverEnv, resultNewVars] = await get_params_for_path_array_1.default(ssm, paths);
    const resultVars = argv.newEnv ? resultNewVars : resultVarsOverEnv;
    writeDotenv(resultVars);
}
exports.default = exportEnv;
function writeJson(o) {
    process.stdout.write(JSON.stringify(o, null, 2));
}
function writeDotenv(o) {
    for (let key in o) {
        process.stdout.write(`${key}=${o[key]}\n`);
    }
    process.stdout.write('\n');
}
//# sourceMappingURL=export.js.map