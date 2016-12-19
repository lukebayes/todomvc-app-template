const Task = require('../../').Task;
const assert = require('chai').assert;
const jsdom = require('jsdom').jsdom;
const renderElement = require('nomplate').renderElement;
const sinon = require('sinon');
const taskItem = require('../../').taskItem;

describe('TaskItem', () => {
  let document;
  let task;
  let onChange;
  let onDestroy;
  let element;

  beforeEach(() => {
    document = jsdom('<body></body>');

    onChange = sinon.spy();
    onDestroy = sinon.spy();

    task = new Task('fake-id', 'Item One');
    // Gnar Not loving this mess.
    element = renderElement(taskItem(task, onChange, onDestroy), document);
  });

  it('is callable', () => {
    assert.equal(task.id, 'fake-id');
    assert.isFalse(task.isComplete);
    assert(element);
  });

  it('can be deleted', () => {
    element.querySelector('.destroy').click();
    assert(onDestroy.calledOnce);
  });

  it('can be completed', () => {
    element.querySelector('.toggle').click();
    assert(onChange.calledOnce);
    assert(task.isComplete);
  });

  it('can enter edit mode', () => {
    // Gnar Gnar! Need helpers!
    const event = document.createEvent('MouseEvent');
    event.initEvent('dblclick', true, true);
    element.querySelector('label').dispatchEvent(event);
    assert(task.isEditing);
    assert(onChange.calledOnce);
    assert(onChange.calledWithMatch(task, sinon.match.func));
    // Render a new element just like the parent context would.
    element = renderElement(taskItem(task, onChange, onDestroy), document);
    assert.equal(element.className, 'editing');
  });
});
