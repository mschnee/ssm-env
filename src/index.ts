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

const argv = yargs.demandCommand().command(
  "export",
  "Exports to STDOUT",
  builder => builder.usage('$0 export <prefix1> <prefix2>... <prefixN>').option('awsRegion', {
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
    }),
  exportEnv
).argv;
