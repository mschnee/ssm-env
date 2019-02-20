"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const exec_1 = require("./commands/exec");
const export_1 = require("./commands/export");
const dotenv_1 = require("dotenv");
var dotenvFile = {};
if (fs.existsSync(path.join(process.cwd(), '.env'))) {
    dotenvFile = dotenv_1.parse(fs.readFileSync(path.join(process.cwd(), '.env')));
}
const splitIndex = process.argv.findIndex(a => a === '--');
let envArgs, execArgs;
if (splitIndex >= 0) {
    envArgs = process.argv.slice(0, splitIndex);
    execArgs = process.argv.slice(splitIndex + 1, process.argv.length);
}
else {
    envArgs = process.argv;
}
const argv = yargs(envArgs.slice(2))
    .demandCommand()
    .command("export <prefixPaths..>", "Exports to STDOUT", builder => builder.usage('$0 path1 path2 path3').option('awsRegion', {
    type: 'string',
    default: process.env.AWS_REGION || dotenvFile.AWS_REGION || 'us-east-1',
    required: true
}).option('awsAccessKeyId', {
    type: 'string',
    default: process.env.AWS_ACCESS_KEY_ID || dotenvFile.AWS_ACCESS_KEY_ID,
    required: true
}).option('awsSecretAccessKey', {
    type: 'string',
    default: process.env.AWS_SECRET_ACCESS_KEY || dotenvFile.AWS_SECRET_ACCESS_KEY,
    required: true
}).option('awsSsmEndpoint', {
    type: 'string',
    default: null,
}).option('newEnv', {
    type: 'boolean',
    default: true,
    describe: 'Only exports new environment variables from SSM'
}).option('dotenv', {
    type: 'boolean',
    default: false,
    describe: 'Use dotenv to load in a .env file.'
}).positional('prefixPaths', {
    type: 'string'
}), export_1.default).command("exec <prefixPaths..>", "Exports to STDOUT", builder => builder.usage('$0 path1 path2 -- node path/to/script.js').option('awsRegion', {
    type: 'string',
    default: process.env.AWS_REGION || dotenvFile.AWS_REGION || 'us-east-1',
    required: true
}).option('awsAccessKeyId', {
    type: 'string',
    default: process.env.AWS_ACCESS_KEY_ID || dotenvFile.AWS_ACCESS_KEY_ID,
    required: true
}).option('awsSecretAccessKey', {
    type: 'string',
    default: process.env.AWS_SECRET_ACCESS_KEY || dotenvFile.AWS_SECRET_ACCESS_KEY,
    required: true
}).option('awsSsmEndpoint', {
    type: 'string',
    default: null,
}).option('newEnv', {
    type: 'boolean',
    default: true,
    describe: 'Only exports new environment variables from SSM'
}).option('dotenv', {
    type: 'boolean',
    default: false,
    describe: 'Use dotenv to load in a .env file.'
}).positional('prefixPaths', {
    type: 'string'
}), (argv) => {
    exec_1.default(argv, execArgs);
}).argv;
console.log(argv);
//# sourceMappingURL=index.js.map