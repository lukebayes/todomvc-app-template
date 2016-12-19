const dom = require('nomplate').dom;

// Maximum character count for task summary.
const MAX_LENGTH = 1024;

// The key code for the enter key.
const ENTER_KEY_CODE = 13;

function header(onAddTask) {
  if (!onAddTask) {
    throw new Error('header factory requires onAddTask handler');
  }

  /**
   * Store the DOM element for the input text field whenever it is rendered.
   *
   * This should allow us to clear it's value and focus it.
   */
  function onInputRendered(element) {
    element.focus();
  }

  /**
   * Called whenever the input receives a key up, only does work if the
   * provided key is an Enter key.
   */
  function onKeyUp(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      const element = event.target;
      // Truncate the input string to MAX_LENGTH, before forwarding out of component.
      const value = element.value.substr(0, MAX_LENGTH);
      if (value !== '') {
        element.value = '';
        onAddTask(value);
      }
    }
  }

  return dom.header({className: 'header'}, () => {
    dom.h1('todos');
    dom.input({
      autofocus: true,
      className: 'new-todo',
      onRender: onInputRendered,
      onkeyup: onKeyUp,
      placeholder: 'What needs to be done?',
    });
  });
}

// Export the MAX_LENGTH value to clients.
header.MAX_LENGTH = MAX_LENGTH;

module.exports = header;

