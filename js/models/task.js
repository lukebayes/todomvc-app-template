const generateId = require('nomplate').generateId;

class Task {
  constructor(id, summary, optIsComplete) {
    this.id = id || generateId();
    this.summary = summary;
    this.isEditing = false;
    this.isComplete = !!optIsComplete;
  }

  toggleComplete() {
    this.isComplete = !this.isComplete;
  }

  setIsComplete(isComplete) {
    this.isComplete = isComplete;
  }

  setIsEditing(isEditing) {
    this.isEditing = isEditing;
  }

  setSummary(summary) {
    this.summary = summary;
  }
}

module.exports = Task;
