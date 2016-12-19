const assert = require('chai').assert;
const header = require('../../').header;
const renderElement = require('nomplate').renderElement;
const sinon = require('sinon');
const testHelper = require('nomplate/test_helper');

describe('Header', () => {
  let doc;
  let element;
  let inputElement;
  let onAddTask;

  /**
   * Get the added task name from the most recent call.
   */
  function getAddedHandlerValue() {
    return onAddTask.getCalls()[0].args[0];
  }

  function simulateEnter() {
    testHelper.fire(inputElement, 'keyup', {keyCode: 13});
  }

  /**
   * Get an input string that is equal to the maximum length.
   */
  function getLongInput() {
    const chars = [];
    for (var i = 0; i < header.MAX_LENGTH; i++) {
      chars.push('a');
    }

    return chars.join('');
  }

  beforeEach(() => {
    onAddTask = sinon.spy();
    doc = testHelper.createWindow().document;
  });

  beforeEach(() => {
    element = renderElement(header(onAddTask), doc);
    inputElement = element.querySelector('input');
  });

  it('requires an onAddTaskHandler', () => {
    assert.throws(() => {
      header();
    }, /requires onAddTask handler/);
  });

  it('renders the header view', () => {
    assert(element);
    assert(inputElement);
    assert.equal(element.nodeName, 'HEADER');
    assert.equal(element.firstChild.nodeName, 'H1');
    assert.equal(inputElement.nodeName, 'INPUT');
    assert.equal(inputElement.className, 'new-todo');
  });

  it('handles valid input', () => {
    inputElement.value = 'hello';
    simulateEnter();
    assert.equal(onAddTask.callCount, 1, 'Provided callback was called');
    assert.equal(inputElement.value, '', 'Cleared input element value');
    assert.equal(getAddedHandlerValue(), 'hello');
  });

  it('ignores empty input on enter', () => {
    inputElement.value = '';
    simulateEnter();
    assert.equal(onAddTask.callCount, 0, 'Provided callback was not called');
  });

  it('truncates input that is too long', () => {
    const str = getLongInput();
    inputElement.value = str + '-BBB';
    simulateEnter();
    assert.equal(getAddedHandlerValue(), str);
  });

  it('focuses the input after rendering', (done) => {
    sinon.spy(inputElement, 'focus');
    inputElement.value = 'hello';

    setTimeout(() => {
      try {
        assert.equal(inputElement.focus.callCount, 1);
        done();
      } catch (err) {
        done(err);
      }
    }, 0);
  });
});

