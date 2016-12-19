const dom = require('nomplate').dom;

module.exports = function() {
  const suffix = process.env.NODE_ENV === 'production' ? 'min.js' : 'js';
  const bundleUrl = `static/todomvc.${suffix}`;

  return dom.html({lang: 'en'}, () => {
    dom.head(() => {
      dom.meta({charset: 'utf-8'});
      dom.meta({name: 'viewport', content: 'width=device-width, initial-scale=1'});
      dom.title('Nomplate * TodoMVC');
      dom.link({rel: 'stylesheet', href: 'static/base.css'});
      dom.link({rel: 'stylesheet', href: 'static/index.css'});
      dom.script({src: bundleUrl});
    });

    dom.body(() => {
      dom.div({className: 'todoapp'});
    });
  });
};

