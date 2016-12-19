const app = require('./js/app');
const ready = require('nomplate').ready;
const renderElement = require('nomplate').renderElement;

if (require.main === module) {
  // Build the component tree immediately.
  const element = renderElement(app(global.window), global.document);

  // Wait for document ready to attach component tree to the DOM.
  ready(global.document, () => {
    const context = global.document.querySelector('.todoapp');
    // Attach the component tree to the expected parent element.
    context.appendChild(element);
  });
}
