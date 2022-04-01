import createTapEditor from "./src/createTapEditor";

const wrap = document.getElementById('app');

for (let i = 0; i < 2; i++) {
  const n = document.createElement('div');
  n.style.margin = '20px';
  wrap.appendChild(n);

  createTapEditor({
    root: n,
    initialValue: '*123 2022-04-01 /foo/bar this $$ummm)',
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
}



