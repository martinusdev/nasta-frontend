import AWS from 'aws-sdk';
import moment from "moment";

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.VUE_APP_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.VUE_APP_SECRET_ACCESS_KEY;
AWS.config.region = 'eu-central-1';

const docClient = new AWS.DynamoDB.DocumentClient();

interface ReportItem {
  report_name: string;
  report_value: number;
  report_time: number;
}

/*
Usage:

try {
const data = await listItems();
return { data };
} catch (err) {
return { error: err };
}
*/

/**
 * @deprecated use getReports()
 */
async function listReports() {
  const params = {
    TableName: 'Reports',
    FilterExpression: 'report_name = :row_name and report_time between :starttime and :endtime',
    ExpressionAttributeValues : {
      ':row_name': 'nr_error_rate_martinus',
      ':starttime': moment().subtract(1, 'hour').unix(),
      ':endtime': moment().unix(),
    }
  };
  try {
    const data = await docClient.scan(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

async function getReports(rowName: string, filterExpression: string, expressionAttributeValues: {[key: string]: any}) {
  filterExpression = 'report_name = :row_name and ' + filterExpression;
  expressionAttributeValues[':row_name'] = rowName;

  const params = {
    TableName: 'Reports',
    FilterExpression: filterExpression,
    ExpressionAttributeValues : expressionAttributeValues
  };
  try {
    return await docClient.scan(params).promise();
  } catch (err) {
    return err;
  }
}

export { listReports, getReports, ReportItem };
