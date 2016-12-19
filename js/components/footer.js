const dom = require('nomplate').dom;

function renderFooterLink(href, label, isSelected) {
  dom.li({className: label.toLowerCase()}, () => {
    dom.a({href, className: isSelected ? 'selected' : ''}, label);
  });
}

/**
 * Render the application footer and connect user gestures to application
 * callbacks.
 */
function footer(allTasks, currentSection, onClearCompleted) {
  if (!allTasks) {
    throw new Error('footer requires non-null tasks');
  }

  if (allTasks.length > 0) {
    const remainingTasks = allTasks.filter(task => !task.isComplete);

    return dom.footer({className: 'footer'}, () => {
      dom.span({className: 'todo-count'}, `${remainingTasks.length} items left`);
      dom.ul({className: 'filters'}, () => {
        renderFooterLink('#/', 'All', currentSection !== 'active' && currentSection !== 'completed');
        renderFooterLink('#/active', 'Active', currentSection === 'active');
        renderFooterLink('#/completed', 'Completed', currentSection === 'completed');
      });

      if (allTasks.some(task => task.isComplete)) {
        dom.button({className: 'clear-completed', onclick: onClearCompleted}, 'Clear completed');
      }
    });
  }
}

module.exports = footer;
