import createTapEditor from "./src/createTapEditor";

createTapEditor({
  root: document.getElementById('app'),
  beans: [
    { name: 'income', value: 'income' },
    { name: 'donation', value: 'donation' }
  ],
  events: [
    { name: 'eating out', value: '"eating out"' },
    { name: 'pushups', value: 'pushups' }
  ],
  tagnames: [
    { name: 'inspiration', value: 'inspiration' },
    { name: 'wanna buy', value: '"wanna buy"' }
  ],
  folders: [
    { name: 'work', value: 'work',
      children: [
        { name: 'todos', value: 'todos' },
        { name: 'memos', value: 'memos' }
      ]
    },
    { name: 'Baz Qux', value: '"Baz Qux"',
      children: [
        { name: 'more here', value: '"more here"' }
      ]
    }
  ]
});
