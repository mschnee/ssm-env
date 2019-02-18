"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const export_1 = require("./commands/export");
const dotenv_1 = require("dotenv");
var dotenvFile = {};
if (fs.existsSync(path.join(process.cwd(), '.env'))) {
    dotenvFile = dotenv_1.parse(fs.readFileSync(path.join(process.cwd(), '.env')));
}
const argv = yargs.demandCommand().command("export", "Exports to STDOUT", builder => builder.usage('$0 export <prefix1> <prefix2>... <prefixN>').option('awsRegion', {
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
}), export_1.default).argv;
//# sourceMappingURL=index.js.map