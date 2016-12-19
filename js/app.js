const Storage = require('./storage');
const Task = require('./models/task');
const dom = require('nomplate').dom;
const footer = require('./components/footer');
const header = require('./components/header');
const taskItem = require('./components/task_item');
const taskList = require('./components/task_list');

/**
 * Custom application entry point. This function will generally only be called
 * once during a given application's lifecycle. It must be provided with an
 * instance that looks like a DOM Window.
 */
function app(_window) {
  const window = _window;
  const storage = new Storage(_window.localStorage);
  const allTasks = storage.load();

  function getTasksForSection(section) {
    if (section === 'active') {
      return allTasks.filter(task => !task.isComplete);
    } else if (section === 'completed') {
      return allTasks.filter(task => task.isComplete);
    }
    return allTasks;
  }

  return dom.div((update) => {
    const section = _window.location.hash.substr(2);
    const tasks = getTasksForSection(section);

    /**
     * Listen for changes to the hash portion of the URL.
     */
    window.onhashchange = function onHashChangeHandler() {
      update();
    };

    /**
     * Remove the provided task.
     */
    function removeTask(task) {
      const index = allTasks.indexOf(task);
      allTasks.splice(index, 1);
    }

    function getDestroy(task) {
      return function destroyHandler() {
        removeTask(task);
        storage.update(allTasks);
        update();
      };
    }

    function onTaskChanged(task, renderComplete) {
      allTasks.forEach((item) => {
        // Ensure only one task is editing at a time.
        if (item !== task && item.isEditing) {
          item.setIsEditing(false);
        }
      });
      storage.update(allTasks);
      update(renderComplete);
    }

    /**
     * Forward a factory function to the TaskList so that we do not need to
     * pass a bunch of handlers through the task list interface.
     */
    function getTaskComponentFactory() {
      return function(task) {
        return taskItem(task, onTaskChanged, getDestroy(task));
      };
    }

    /**
     * Add a task to the task list, store the new list and render the new data.
     */
    function addTask(summary, completeHandler) {
      allTasks.push(new Task(null, summary));
      storage.update(allTasks);
      update(completeHandler);
    }

    /**
     * Toggle completion state of all tasks.
     */
    function onToggleAll(event) {
      const isChecked = event.target.checked;
      tasks.forEach((task) => {
        task.setIsComplete(isChecked);
      });
      storage.update(allTasks);
      update();
    }

    /**
     * Remove all tasks that are completed.
     */
    function onClearCompleted() {
      allTasks.slice().forEach((task) => {
        if (task.isComplete) {
          removeTask(task);
        }
      });
      storage.update(allTasks);
      update();
    }

    /**
     * Render the application sections.
     */
    header(addTask);
    taskList(tasks, onToggleAll, getTaskComponentFactory());
    footer(allTasks, section, onClearCompleted);
  });
}

module.exports = app;

