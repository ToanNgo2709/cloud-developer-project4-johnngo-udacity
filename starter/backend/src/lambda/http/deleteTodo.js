import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { createLogger } from '../../utils/logger.mjs';
import { deleteTodo } from '../../biz-logic/todos.mjs';
import { getUserId } from '../utils.mjs';


const logger = createLogger('Todos logger');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Delete Todo');

    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);

    await deleteTodo(todoId, userId);

    return {
      statusCode: 204,
      body:  JSON.stringify({
        todo_id: todoId
      })
    };
  });