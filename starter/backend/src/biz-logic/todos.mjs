import { uuid } from 'uuidv4';

import { TodosAccess } from '../db-layer/todos-db-access.mjs';
import { createLogger } from '../utils/logger.mjs';
import { commonAttachmentUtil } from '../storage/attachment-utils.mjs';


const loggerApp = createLogger('Todos: Business Logic CRUD');
const todosAccess = new TodosAccess();
const attachmentUtil = new commonAttachmentUtil();

// get all items for user
export async function getTodos(userId) {

    loggerApp.info('Todos: Get Todos');

    return todosAccess.getTodos(userId);
}

// create new item 
export async function createTodo(newTodo, userId) {

    loggerApp.info('Todos: Create Todo');

    // create uuid
    const todoId = uuid();

    const createdAt = new Date().toISOString();
    const attachmentImageUrl = await attachmentUtil.createAttachmentUrl(todoId);

    // new item
    const newItem = {
        todoId,
        userId,
        attachmentUrl: attachmentImageUrl,
        createdAt: createdAt,
        done: false,
        ...newTodo
    };

    // wait for create new todo
    return await todosAccess.createTodo(newItem);
}

// update item todo
export async function updateTodo(userId, todoId, todoUpdate) {

    loggerApp.info('Todos: Update Todo');

    return await todosAccess.updateTodo(userId, todoId, todoUpdate);
}

//delete item todo
export async function deleteTodo(todoId, userId) {

    loggerApp.info('Todos: Delete Todo');

    return await todosAccess.deleteTodo(todoId, userId);
}

//create upload url for todo item
export async function createAttachmentPresignedUrl(todoId) {

    loggerApp.info('Todos: Create Attachment URL');

    return await attachmentUtil.createUploadUrl(todoId);
}
