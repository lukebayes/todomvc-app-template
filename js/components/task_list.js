const dom = require('nomplate').dom;

/**
 * Render a task list and connect user gestures to application callbacks.
 */
function taskList(tasks, onToggleAll, taskFactory) {
  if (!tasks) {
    throw new Error('taskList requires non-null tasks');
  }

  if (typeof onToggleAll !== 'function') {
    throw new Error('taskList requires onToggleAll handler');
  }

  if (tasks.length) {
    const allTasksCompleted = tasks.every(task => task.isComplete);

    return dom.section({className: 'main'}, () => {
      dom.ul({className: 'todo-list'}, () => {
        dom.input({
          className: {
            hidden: (tasks.length === 0),
            'toggle-all': true,
          },
          id: 'toggle-all',
          type: 'checkbox',
          checked: allTasksCompleted,
          onclick: onToggleAll,
        });
        dom.label({for: 'toggle-all'}, 'Mark all as complete');
        tasks.forEach((task) => {
          taskFactory(task);
        });
      });
    });
  }
}

module.exports = taskList;
