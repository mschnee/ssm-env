ssm-env
=======

A very simple cross-env-like utility for running a program with and environment enriched from AWS SSM ParameterStore values.

With `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` already in your environment, or in a `.env` file:

The arguments assume that you are using SSM Parameter Store with paths, e.g.

```
/global/static_file_host=https://static.yourdomain.com
/global/some_cool_key=42
/qa/app1/static_file_host=https://app1.static.yourdomain.com
```

`ssm-env` will never overwrite an environment variable once it's set.


## Examples
```sh
ssm-env exec "/qa/app1/" "/global/" -- node path/to/app.js
```

Manually specifying
```sh
ssm-env exec --awsAccessKeyId=yourkey --awsSecretAccessKey=yoursecret "/qa/app1/" "/global/" -- node path/to/app.js
```

To simply print out the environment:
```sh
ssm-env EXPORT "/qa/app1/" "/global/" -- node path/to/app.js
STATIC_FILE_HOST=https://app1.static.yourdomain.com
SOMNE_COOL_KEY=42
```

To save it to a file:
```sh
ssm-env EXPORT "/qa/app1/" "/global/" -- node path/to/app.js > .env
```