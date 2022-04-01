import './reset.css';
import './main.css';
import sowhat from '@tatatap-com/sowhat';
import createTapEditor, { suggest } from "./lib/index";

////////////////////////
// CONFIGURE EXAMPLES //
////////////////////////

const examples = [
  '/bar something in another folder',
  '/foo something in a folder',
  '/budget +income:200',
  '/budget -income:100',
]

///////////////
// UTILITIES //
///////////////

const notesRoot = document.getElementById('notes');
const previewRoot = document.getElementById('preview');
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
    if (!c) return;
    if (typeof c === 'string') {
      elm.innerText = c;
    } else {
      elm.appendChild(c);
    }
  });
  return elm;
};

//////////////////////
// RUN THE EXAMPLES //
//////////////////////

const STATE = {
  notes: [],
}

const updateSuggestions = () => {
  const folderMap = {};
  const events = [];
  const beans = [];
  const tags = [];

  STATE.notes.forEach(({ parsed }) => {
    let c = folderMap;
    parsed.folder.forEach((f, i) => {
      const fname = f.value.substring(1);
      if (!fname) return;
      c[fname] = c[fname] || {};
      c = c[fname];
    });
    parsed.event.forEach(e => { events.push(e.value.label); });
    parsed.bean.forEach(e => { beans.push(e.value.symbol); });
    parsed.tag.forEach(e => { tags.push(e.value); });
  });
  suggest('folder', makeFolders(folderMap));
  suggest('event', makeOptions(events));
  suggest('bean', makeOptions(beans));
  suggest('tag', makeOptions(tags));
}

const previewContent = create('div', { class: 'ex-preview-content' });

const updatePreview = () => {
  if (previewContent.children.length) previewContent.children[0].remove();

  const folderMap = { label: '/', notes: [], children: {} };
  const eventsMap = {};
  const beansMap = {};
  const tagsMap = {};

  STATE.notes.forEach(({ parsed }, i) => {
    // update folder structure...
    let c = folderMap;
    parsed.folder.forEach((f) => {
      const fname = f.value.substring(1);
      if (!fname) return;
      c.children[fname] = c.children[fname] || { label: f.value, notes: [], children: {} };
      c = c.children[fname];
    });
    c.notes.push(parsed.text);
    // parsed.event.forEach(e => { events.push(e.value); });
    parsed.bean.forEach(({ value }) => {
      beansMap[value.symbol] = beansMap[value.symbol] || 0;
      console.log();
      beansMap[value.symbol] += parseFloat(value.value) * (value.sign === '+' ? 1 : -1);
    });
  });

  const renderFolderMap = (f) => {
    return create('details', { open: true }, [
      create('summary', {}, `${f.label} (${f.notes.length})`),
      create('div', { class: 'folder-content' }, [
        create('ul', { class: 'folder-note-list' }, f.notes.map((n) => {
          return create('li', { class: 'folder-note' }, n)
        })),
        ...Object.values(f.children).map(renderFolderMap),
      ])
    ]);
  };

  const renderBeans = () => {
    return create('ul', {},
      Object.entries(beansMap)
        .sort((a, b) => a[0] - b[0])
        .map(([sym, total]) => {
          console.log(sym, total)
          return create('li', {}, [
            create('strong', {}, sym),
            create('span', [], ` ${total}`),
          ]);
      })
    );
  };

  previewContent.appendChild(create('div', { class: 'ex-dynamic-content' }, [
    create('div', { class: 'preview-section' }, [
      create('h3', { class: 'preview-section-title' }, 'Beans'),
      renderBeans(),
    ]),
    create('div', { class: 'preview-section' }, [
      create('h3', { class: 'preview-section-title' }, 'Folders'),
      renderFolderMap(folderMap),
    ])
  ]));
};

const exampleRoot = create('div', { class: 'ex-examples' });

const addNote = (initialValue) => {
  const note = {};

  const editor = create('div', { class: 'ex-editor' })
  const output = create('p', { class: 'ex-output' });

  const editorView = createTapEditor({
    root: editor,
    initialValue,
    onChange: (v) => {
      note.parsed =  sowhat.parse(v);
      output.innerText = JSON.stringify(note.parsed, null, 2);
      updatePreview();
    },
    onFocus: () => {
      updateSuggestions();
    },
  });

  note.root = create('div', { class: 'ex-wrap'}, [
    editor,
    create('details', { class: 'ex-details' }, [
      create('summary', {}, 'Parser output'),
      output,
    ]),
    create('button', {
      class: 'ex-delete',
      onclick: () => {
        note.root.remove();
        STATE.notes.splice(STATE.notes.indexOf(note), 1);
        updateSuggestions();
        updatePreview();
      }
    }, '✕')
  ]);

  exampleRoot.prepend(note.root);
  editorView.focus();
  STATE.notes.push(note);
}

notesRoot.appendChild(create('div', {}, [
  create('h2', { class: 'panel-title' }, [
    'Notes',
    create('button', {
      class: 'ex-add-note',
      onclick: () => addNote(),
    }, 'Add note'),
  ]),
  create('div', { class: 'example-panel-content' }, [
    exampleRoot,
  ])
]));

previewRoot.appendChild(create('div', {}, [
  create('h2', { class: 'panel-title' }, 'Preview' ),
  create('div', { class: 'example-panel-content' }, previewContent)
]));

examples.forEach(addNote);
addNote();
