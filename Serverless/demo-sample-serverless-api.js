const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'swagger-api-demo-table';

const userPath = '/users';
const userListPath = '/users-list';

exports.handler = async function(event,context) {
    // console.log('Request Event: ' , event);
    // console.log('Request Event httpMethod: ' + event.httpMethod);
    // console.log('Request Event Path: ' + event.path);
    // console.log('Request Event QueryParam: ' + event.queryStringParameters);
    // console.log('Request Event RequestBody: ' + event.body);
    let response;
    switch(true){
        case event.httpMethod === 'GET' && event.path === userPath:
            response = await getUser(event.queryStringParameters.id);
            break;
        case event.httpMethod === 'GET' && event.path === userListPath:
            response = await getUserList()
            break;
        case event.httpMethod === 'POST' && event.path === userPath:
            response = await saveUser(JSON.parse(event.body));
            break;
        case event.httpMethod === 'PATCH' && event.path === userPath:
            const requestBody = JSON.parse(event.body);
            response = await updateUser(requestBody.id, requestBody.updateKey, requestBody.updateValue);
            break;
        case event.httpMethod === 'DELETE' && event.path === userPath:
            response = await deleteUser(JSON.parse(event.body).id);
            break;
        default:
            response = buildResponse(404, 'Data Not Fund');
    }
    return response;
}
async function getUser(MemberId) {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'id': MemberId
      }
    }
    return await dynamodb.get(params).promise().then((response) => {
      return buildResponse(200, response.Item);
    }, (error) => {
      console.error('Error: ', error);
      return error;
    });
}
  
async function getUserList() {
    const params = {
      TableName: dynamodbTableName
    }
    const allUsers = await scanDynamoRecords(params, []);
    const body = {
      users: allUsers
    }
    return buildResponse(200, body);
 }
  
async function scanDynamoRecords(scanParams, itemArray) {
    try {
      const dynamoData = await dynamodb.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
      }
      return itemArray;
    } catch(error) {
      console.error('Error: ', error);
      return error;
    }
}
  
async function saveUser(requestBody) {
    const params = {
      TableName: dynamodbTableName,
      Item: requestBody
    }
    return await dynamodb.put(params).promise().then(() => {
      const body = {
        Operation: 'SAVE',
        Message: 'SUCCESS',
        Item: requestBody
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Error: ', error);
      return error;
    })
}
  
async function updateUser(MemberId, updateKey, updateValue) {
  let params = null;
  if(updateKey === 'name'){
    params = {
      TableName: dynamodbTableName,
      Key: {
        'id': MemberId
      },
      UpdateExpression: `set #nm = :value`,
      ExpressionAttributeValues: {
        ':value': updateValue
      },
      ExpressionAttributeNames: {
        "#nm": "name"
      },
      ReturnValues: 'UPDATED_NEW',
    }
  }else{
    params = {
      TableName: dynamodbTableName,
      Key: {
        'id': MemberId
      },
      UpdateExpression: `set ${updateKey} = :value`,
      ExpressionAttributeValues: {
        ':value': updateValue
      },
      ReturnValues: 'UPDATED_NEW',
      
    }
  }
  console.log('update query param ', params);
  return await dynamodb.update(params).promise().then((response) => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Error: ', error);
    return error;
  })
}
  
async function deleteUser(MemberId) {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'id': MemberId
      },
      ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
      const body = {
        Operation: 'DELETE',
        Message: 'SUCCESS',
        Item: response
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Error: ', error);
      return error;
    })
}
  
function buildResponse(statusCode, body) {
    return {
      "statusCode": statusCode,
      "headers": {
        'Content-Type': 'application/json'
      },
      "code": statusCode,
      "message": {
        "body": JSON.stringify(body)
      }
    }
}
  