const Storage = require('../').Storage;
const Task = require('../').Task;
const assert = require('chai').assert;
const testHelper = require('nomplate/test_helper');

describe('Storage', () => {
  let localStorage;
  let instance;

  beforeEach(() => {
    localStorage = new testHelper.FakeStorage();
    instance = new Storage(localStorage);
  });

  it('requires LocalStorage', () => {
    assert.throws(() => {
      const instance = new Storage();
    }, /requires LocalStorage/);
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('loads from empty items', () => {
    const items = instance.load();
    assert.equal(items.length, 0);
  });

  it('updates items', () => {
    const items = [
      new Task(null, 'abcd', true),
      new Task(null, 'efgh', false),
      new Task(null, 'ijkl', false),
    ];

    instance.update(items);
    const result = instance.load();
    assert.equal(result.length, 3);

    assert.equal(result[0].summary, 'abcd');
    assert(result[0].isComplete);

    assert.equal(result[1].summary, 'efgh');
    assert.isFalse(result[1].isComplete);

    assert.equal(result[2].summary, 'ijkl');
    assert.isFalse(result[2].isComplete);
  });
});
