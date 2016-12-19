const assert = require('chai').assert;
const footer = require('../../').footer;
const jsdom = require('jsdom').jsdom;
const renderElement = require('nomplate').renderElement;
const sinon = require('sinon');

describe('Footer component', () => {
  let tasks;
  let currentSection;
  let onClearCompleted;

  function assertSelectedButton(nomElement, className) {
    const filters = nomElement.children[1];
    let found = false;

    filters.children.forEach((child) => {
      if (child.className === className) {
        found = true;
        assert.equal(child.children[0].className, 'selected');
      } else {
        assert.equal(child.children[0].className, '', 'Did not expect ' + child.className + ' to be selected');
      }
    });
    assert(found, 'Did not find expected footer entry');
  }

  beforeEach(() => {
    tasks = [
      {title: 'abcd', isComplete: false},
      {title: 'efgh', isComplete: false},
      {title: 'ijkl', isComplete: false},
    ];

    onToggleAll = sinon.spy();
    onClearCompleted = sinon.spy();
  });

  it('requires task list', () => {
    assert.throws(() => {
      footer();
    }, /requires non-null tasks/);
  });

  it('displays remaining tasks count', () => {
    const nomElement = footer(tasks, '/', onClearCompleted);
    assert.equal(nomElement.children[0].textContent, '3 items left');
  });

  it('displays all section when active', () => {
    const nomElement = footer(tasks, '', onClearCompleted);
    assertSelectedButton(nomElement, 'all');
  });

  it('displays active section when active', () => {
    const nomElement = footer(tasks, 'active', onClearCompleted);
    assertSelectedButton(nomElement, 'active');
  });

  it('displays completed section when active', () => {
    const nomElement = footer(tasks, 'completed', onClearCompleted);
    assertSelectedButton(nomElement, 'completed');
  });
});
