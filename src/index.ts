import * as fs from 'fs';
import * as path from 'path';

import * as yargs from "yargs";

import execEnv from "./commands/exec";
import exportEnv from "./commands/export";

import { parse } from 'dotenv';

var dotenvFile: any = {};
if (fs.existsSync(path.join(process.cwd(), '.env'))) {
    dotenvFile = parse(fs.readFileSync(path.join(process.cwd(), '.env')));
}

const splitIndex = process.argv.findIndex(a => a === '--');
let envArgs: string[], execArgs: string[];

if (splitIndex >= 0) {
    envArgs = process.argv.slice(0, splitIndex);
    execArgs = process.argv.slice(splitIndex + 1, process.argv.length);
} else {
    envArgs = process.argv;
}

const argv = yargs(envArgs.slice(2))
    .demandCommand()
    .command(
      "export <prefixPaths..>",
      "Exports to STDOUT",
      builder => builder.usage('$0 path1 path2 path3').option('awsRegion', {
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
        }),
      exportEnv
    ).command(
      "exec <prefixPaths..>",
      "Exports to STDOUT",
      builder => builder.usage('$0 path1 path2 -- node path/to/script.js').option('awsRegion', {
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
        }),
      (argv) => {
        execEnv(argv, execArgs)
      }
    ).argv;
