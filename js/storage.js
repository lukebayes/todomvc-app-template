const Task = require('./models/task');

class Storage {
  constructor(localStorage) {
    if (!localStorage) {
      throw new Error('Storage requires LocalStorage reference');
    }

    this._storageKey = 'todo-items';
    this._localStorage = localStorage;
  }

  load() {
    const items = [];
    const storedItems = this._localStorage.getItem(this._storageKey);

    if (storedItems) {
      global.JSON.parse(storedItems).forEach((item) => {
        items.push(new Task(item.id, item.summary, item.isComplete));
      });
    }

    return items;
  }

  update(allTasks) {
    const serialized = allTasks.map(task => ({
      id: task.id,
      summary: task.summary,
      isComplete: task.isComplete,
    }));

    this._localStorage.setItem(this._storageKey, global.JSON.stringify(serialized));
  }
}

module.exports = Storage;

