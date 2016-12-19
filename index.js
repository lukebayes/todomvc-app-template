const Storage = require('./js/storage');
const Task = require('./js/models/task');
const app = require('./js/app');
const footer = require('./js/components/footer');
const header = require('./js/components/header');
const taskItem = require('./js/components/task_item');
const taskList =require('./js/components/task_list');

module.exports = {
  Storage,
  Task,
  app,
  footer,
  header,
  taskItem,
  taskList,
};

