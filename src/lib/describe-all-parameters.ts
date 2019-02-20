import * as AWS from 'aws-sdk';

export default async function describeAllParameters(ssm: AWS.SSM, filters: AWS.SSM.ParameterStringFilterList): Promise<AWS.SSM.ParameterMetadata[]> {
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
