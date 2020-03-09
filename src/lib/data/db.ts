import AWS from 'aws-sdk';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.VUE_APP_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.VUE_APP_SECRET_ACCESS_KEY;
AWS.config.region = 'eu-central-1';

const docClient = new AWS.DynamoDB.DocumentClient();

/*
Usage: 

try {
const data = await listItems();
return { data };
} catch (err) {
return { error: err };
}
*/

async function listReports() {
  const params = {
    TableName: 'Reports',
  };
  try {
    const data = await docClient.scan(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

export { listReports };
