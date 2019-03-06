const dom = require('nomplate').dom;

/**
 * Render a Task Item component and wire up local behavior.
 *
 * @param {Task} task The task to be displayed.
 * @param {Function} onTaskChanged Function to call when a task state changes
 *   and updates might cause other components to change their view.
 * @param {Function} onDestroyTask Function to call when a task should be
 *   removed.
 */
function taskItem(task, onTaskChanged, onDestroyTask) {
  const elementId = `t-${task.id}`;
  const classNames = {
    completed: task.isComplete,

    editing: task.isEditing,
  };

  return dom.li({id: elementId, key:elementId, className: classNames}, () => {
    let inputElement;

    function onInputRendered(element) {
      inputElement = element;
    }

    function toggleTaskComplete() {
      task.toggleComplete();
      onTaskChanged(task);
    }

    function updateTaskSummary(event) {
      task.setSummary(event.target.value);
      task.setIsEditing(false);
      onTaskChanged(task);
    }

    function exitEditMode() {
      task.setIsEditing(false);
      onTaskChanged(task);
    }

    function onEditKeyUp(event) {
      if (event.keyCode === 13) {
        updateTaskSummary(event);
      } else if (event.keyCode === 27) {
        exitEditMode();
      }
    }

    function enterEditMode(event) {
      task.setIsEditing(true);
      // const parent = event.target.parentNode.parentNode;
      event.stopPropagation();

      onTaskChanged(task, () => {
        inputElement.select();
      });

      return false;
    }

    // Render the view children
    dom.div({className: 'view'}, () => {
      dom.input({
        className: 'toggle',
        type: 'checkbox',
        checked: task.isComplete,
        onclick: toggleTaskComplete,
      });
      dom.label({onmouseup: onTaskChanged, ondblclick: enterEditMode}, task.summary);
      dom.button({className: 'destroy', onclick: onDestroyTask});
    });
    dom.input({onRender: onInputRendered, className: 'edit', value: task.summary, onkeyup: onEditKeyUp});
  });
}

module.exports = taskItem;

