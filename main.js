import './reset.css';
import './main.css';
import sowhat from '@tatatap-com/sowhat';
import createTapEditor, { addSuggestion } from "./lib/index";

////////////////////////
// CONFIGURE EXAMPLES //
////////////////////////

const examples = Array.from(new Array(4)).map(_ => '*123 2022-04-01 /foo/bar this $$ummm)');

///////////////
// UTILITIES //
///////////////

const notesRoot = document.getElementById('notes');
const SPACE_PATTERN = /\s/;
const makeOption = v => ({ name: v, value: SPACE_PATTERN.test(v) ? `"${v}"` : v });
const makeOptions = names => names.map(makeOption);
const makeFolders = (folderMap) => {
  return Object.entries(folderMap).map(([k, v]) => {
    const f = makeOption(k);
    if (v !== true) f.children = makeFolders(v);
    return f;
  });
};

function create(tag, attr = {}, children = []) {
  children = Array.isArray(children) ? children : [children];
  const elm = document.createElement(tag);
  for (let a in attr) {
    if (a.startsWith('on')) {
      elm.addEventListener(a.slice(2).toLowerCase(), attr[a])
    } else {
      if (attr[a]) elm.setAttribute(a, attr[a]);
    }
  }
  children.forEach((c) => {
    if (typeof c === 'string') {
      elm.innerText = c;
    } else {
      elm.appendChild(c);
    }
  });
  return elm;
};

addSuggestion('folder', makeFolders({
  foo: true,
  bar: {
    baz: true,
  }
}));

//////////////////////
// RUN THE EXAMPLES //
//////////////////////

const exampleRoot = create('div', { class: 'ex-examples' });

const addNote = (initialValue) => {
  const editor = create('div', { class: 'ex-editor' })
  const output = create('p', { class: 'ex-output' });

  createTapEditor({
    root: editor,
    initialValue,
    onChange: (v) => {
      output.innerText = JSON.stringify(sowhat.parse(v), null, 2)
    },
  })

  exampleRoot.appendChild(create('div', { class: 'ex-wrap'}, [
    editor,
    create('details', { class: 'ex-details' }, [
      create('summary', {}, 'Parser output'),
      output,
    ])
  ]));
}

notesRoot.appendChild(create('div', {}, [
  create('h2', { class: 'panel-title' }, 'Notes' ),
  create('div', { class: 'example-panel-content' }, [
    exampleRoot,
    create('button', {
      class: 'ex-add-note',
      onclick: () => addNote(),
    }, 'Add note'),
  ])
]));


examples.forEach(addNote);
