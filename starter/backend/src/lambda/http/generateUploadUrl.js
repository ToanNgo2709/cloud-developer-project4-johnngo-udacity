import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

import { createAttachmentPresignedUrl } from '../../biz-logic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('Todos logger');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Generate Upload Url');
    const todoId = event.pathParameters.todoId;

    const urlAttach = await createAttachmentPresignedUrl(todoId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        urlAttach
      })
    }
  });