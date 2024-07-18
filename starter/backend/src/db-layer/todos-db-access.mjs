import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

import { createLogger } from '../utils/logger.mjs';

const awsService = new AWSXRay.captureAWS(AWS);
const documentClient = new awsService.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const todosName = process.env.INDEX_NAME;

// logger
const loggerService = createLogger('Data layer:  data layer');

// class todos access
export class TodosAccess {

    // function get todo
    async getTodos(userId) {
        loggerService.info('Data layer:  get todo list');

        const responseData = await documentClient
            .query({
                TableName: todosTable,
                IndexName: todosName,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();

        return responseData.Items;
    }

    // function create todo
    async createTodo(newItem) {

        loggerService.info('Data layer:  create todo item');

        const responseData = await documentClient.put({
            TableName: todosTable,
            Item: newItem
        }).promise();

        loggerService.info(`Create toto item: ${responseData}`);

        return newItem;
    }

    // function update todo
    async updateTodo(userId, todoId, updateItem) {

        loggerService.info('Data layer:  update todo item');
    
        await documentClient
          .update({
            TableName: todosTable,
            Key: {
              todoId,
              userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
              ':name': updateItem.name,
              ':dueDate': updateItem.dueDate,
              ':done': updateItem.done
            },
            ExpressionAttributeNames: {
              '#name': 'name'
            },
            ReturnValues: 'UPDATED_NEW'
          })
          .promise();
    
        return updateItem;
      }
    
      // function delete todo
      async deleteTodo(todoId, userId) {

        loggerService.info('Data layer:  delete todo item');
    
        const responseData = await documentClient
          .delete({
            TableName: todosTable,
            Key: {
              todoId,
              userId
            }
          })
          .promise();
    
        loggerService.info('Todo item deleted', responseData);
    
        return responseData;
      }
    
      // function update todo attachment url
      async updateTodoAttachmentUrl(todoId, userId, attachmentUrl) {

        loggerService.info('Data layer:  update todo attachment url');
    
        await documentClient
          .update({
            TableName: todosTable,
            Key: {
              todoId,
              userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
              ':attachmentUrl': attachmentUrl
            }
          })
          .promise();
      }
}
