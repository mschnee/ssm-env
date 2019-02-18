"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
async function describeAllParameters(ssm, filters) {
    let result = await ssm.describeParameters({
        ParameterFilters: filters
    }).promise();
    if (result.NextToken) {
        let rset = result.Parameters.slice();
        while (result.NextToken) {
            result = await ssm.describeParameters({
                ParameterFilters: filters,
                NextToken: result.NextToken,
            }).promise();
            rset = rset.concat(result.Parameters);
        }
        return rset;
    }
    else {
        return result.Parameters;
    }
}
async function getParameterValues(ssm, names) {
    let results = [];
    for (let i = 0; i < names.length; i += 10) {
        console.log(`Getting ${i}-${i + 10} of ${names.length}`);
        const response = await ssm.getParameters({
            Names: names.slice(i, i + 10)
        }).promise();
        results = results.concat(response.Parameters);
    }
    return results;
}
async function exec(argv) {
    const ssm = new AWS.SSM({
        region: argv.awsRegion,
        accessKeyId: argv.awsAccessKeyId,
        secretAccessKey: argv.awsSecredAccessKey,
        endpoint: argv.awsEndpoint || undefined
    });
    const paths = argv._;
    if (paths[0] === 'export') {
        paths.shift();
    }
    if (!paths || !paths.length) {
        console.error('Missing prefix paths');
        return;
    }
    const varsOverEnv = process.env;
    const newVarsOnly = {};
    const [resultVarsOverEnv, resultNewVars] = await paths.reduce((pr, path) => pr.then(async ([allVars, newVars]) => {
        const requested = await describeAllParameters(ssm, [
            {
                Key: 'Name',
                Option: 'BeginsWith',
                Values: [path]
            }
        ]);
        const names = requested.map(r => r.Name);
        const params = await getParameterValues(ssm, names);
        params.forEach(p => {
            if (!newVars.hasOwnProperty(p.Name)) {
                newVars[p.Name] = p.Value;
            }
            if (!allVars.hasOwnProperty(p.Name)) {
                allVars[p.Name] = p.Value;
            }
        });
        return [allVars, newVars];
    }), Promise.resolve([varsOverEnv, newVarsOnly]));
    const resultVars = argv.newEnv ? resultNewVars : resultVarsOverEnv;
    writeDotenv(resultVars);
}
exports.default = exec;
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