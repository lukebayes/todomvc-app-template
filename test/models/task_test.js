const assert = require('chai').assert;
const Task = require('../../').Task;

describe('Task', () => {
  let instance;

  beforeEach(() => {
    instance = new Task('fake-id', 'abcd');
  });

  it('is instantiable', () => {
    assert.equal(instance.summary, 'abcd');
    assert.isFalse(instance.isComplete);
  });

  it('reads summary', () => {
    assert.equal(instance.summary, 'abcd');
  });

  it('toggles', () => {
    instance.toggleComplete();
    assert(instance.isComplete);
  });

  it('sets complete true', () => {
    instance.setIsComplete(true);
    assert(instance.isComplete);
  });

  it('sets complete false', () => {
    instance.setIsComplete(false);
    assert.isFalse(instance.isComplete);
  });
});
