import axios from 'axios';
import AWS from 'aws-sdk';

const apiUrl =
  'https://uqku0w8pp9.execute-api.eu-central-1.amazonaws.com/production/reports';

/**
 * Unmarshalls array values.
 */
function unmarshall(data: any) {
  return data.map(AWS.DynamoDB.Converter.unmarshall);
}

export async function getReports(
  rowName: string,
  filterExpression: string,
  expressionAttributeValues: { [key: string]: any },
) {
  const FilterExpression = 'report_name = :row_name and ' + filterExpression;
  const ExpressionAttributeValues = {
    ':row_name': { S: rowName },
    ...expressionAttributeValues,
  };

  const params = {
    TableName: 'Reports',
    FilterExpression,
    ExpressionAttributeValues,
  };

  try {
    const { data } = await axios.post(apiUrl, params);
    data.Items = unmarshall(data.Items);
    return data;
  } catch (err) {
    return err;
  }
}
