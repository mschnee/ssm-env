import * as AWS from 'aws-sdk';

async function describeAllParameters(ssm: AWS.SSM, filters: AWS.SSM.ParameterStringFilterList): Promise<AWS.SSM.ParameterMetadata[]> {
    let result = await ssm.describeParameters({
        ParameterFilters: filters
    }).promise()

    if (result.NextToken) {
        let rset = result.Parameters.slice();
        while(result.NextToken) {
            result = await ssm.describeParameters({
                ParameterFilters: filters,
                NextToken: result.NextToken,
            }).promise()
            rset = rset.concat(result.Parameters);
        }

        return rset;
    } else {
        return result.Parameters;
    }
}

async function getParameterValues(ssm: AWS.SSM, names: string[]): Promise<AWS.SSM.Parameter[]> {
    let results: AWS.SSM.Parameter[] = [];
    for (let i = 0; i < names.length; i += 10) {
        console.log(`Getting ${i}-${i+10} of ${names.length}`);

        const response = await ssm.getParameters({
            Names: names.slice(i, i+10),
            WithDecryption: true,
        }).promise();

        results = results.concat(response.Parameters);
    }

    return results;
}

export default async function exec(argv: any) {
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

    if(!paths || !paths.length) {
        console.error('Missing prefix paths');
        return;
    }
    const varsOverEnv = process.env;
    const newVarsOnly = {};

    const [resultVarsOverEnv, resultNewVars] = await paths.reduce((pr, path) => pr.then(async ([allVars, newVars])=> {
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
                newVars[p.Name] = p.Value
            }
            if (!allVars.hasOwnProperty(p.Name)) {
                allVars[p.Name] = p.Value
            }
        });
        return [allVars, newVars];
    }),Promise.resolve([varsOverEnv, newVarsOnly]));

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