const assert = require('chai').assert;
const jsdom = require('jsdom').jsdom;
const renderElement = require('nomplate').renderElement;
const sinon = require('sinon');
const taskList = require('../../').taskList;

describe('Task List', () => {
  let tasks;
  let onToggleAll;
  let taskFactory;

  beforeEach(() => {
    tasks = [
      {title: 'abcd'},
      {title: 'efgh'},
      {title: 'ijkl'},
    ];

    onToggleAll = sinon.spy();
    taskFactory = sinon.spy();
  });

  it('requires task list', () => {
    assert.throws(() => {
      taskList();
    }, /requires non-null tasks/);
  });

  it('requires onToggleAll', () => {
    assert.throws(() => {
      taskList([], null);
    }, /requires onToggleAll handler/);
  });

  it('renders tasks', () => {
    const nomElement = taskList(tasks, onToggleAll, taskFactory);
    assert.equal(nomElement.children[0].className, 'todo-list');
  });

  it('renders toggle all checkbox', () => {
    const nomElement = taskList(tasks, onToggleAll, taskFactory);
    const checkbox = nomElement.children[0].children[0];
    assert.equal(checkbox.id, 'toggle-all');
    assert.equal(checkbox.attrs.type, 'checkbox');
    assert.equal(checkbox.attrs.checked, false);
  });

  it('checks toggle all checkbox', () => {
    // Complete all tasks
    tasks.forEach((task) => {
      task.isComplete = true;
    });
    const nomElement = taskList(tasks, onToggleAll, taskFactory);
    const checkbox = nomElement.children[0].children[0];
    // Ensure we render the checkbox as checked.
    assert.equal(checkbox.attrs.checked, true);
  });

  it('renders tasks', () => {
    const nomElement = taskList(tasks, onToggleAll, taskFactory);
    assert.equal(taskFactory.callCount, 3);
  });

  describe('fully rendered', () => {
    let document;

    beforeEach(() => {
      document = jsdom('<body></body>');
    });

    it('calls provided toggleAll function', () => {
      const nomElement = taskList(tasks, onToggleAll, taskFactory);
      const element = renderElement(nomElement, document);
      // Uncomment to see the DOM elements as HTML
      // console.log(element.outerHTML);

      // click the checkbox
      element.firstChild.firstChild.click();
      // Ensure the provided toggle feature was called.
      assert.equal(onToggleAll.callCount, 1);
    });
  });
});
