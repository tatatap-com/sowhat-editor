import createTapEditor from "./src/createTapEditor";

const folders = [
  {
    name: 'todos',
    value: 'todos',
  },
  {
    name: 'Baz Qux',
    value: '"Baz Qux"',
    children: [
      {
        name: 'more here',
        value: '"more here"'
      }
    ]
  }
];

const tagnames = [
  {
    name: 'inspiration',
    value: 'inspiration',
  },
  {
    name: 'wanna buy',
    value: '"wanna buy"',
  }
];

const events = [
  {
    name: 'eating out',
    value: '"eating out"',
  },
  {
    name: 'pushups',
    value: 'pushups',
  }
];

const beans = [
  {
    name: 'income',
    value: 'income',
  },
  {
    name: 'donation',
    value: 'donation',
  }
];

createTapEditor({
  root: document.getElementById('app'),
  beans,
  events,
  folders,
  tagnames,
});
