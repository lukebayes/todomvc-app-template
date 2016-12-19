const app = require('../').app;
const assert = require('chai').assert;
const renderElement = require('nomplate').renderElement;
const testHelper = require('nomplate/test_helper');

describe('Application is instantiable', () => {
  let win;

  beforeEach(() => {
    win = testHelper.createWindow();
  });

  it('is configured for empty data', () => {
    const element = renderElement(app(win), win.document);

    assert(element);
    assert.equal(element.children.length, 1, 'Only the header renders when list is empty');
    assert.equal(element.children[0].nodeName, 'HEADER');
  });
});
