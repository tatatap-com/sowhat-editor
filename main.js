import './reset.css';
import './main.css';
import sowhat from '@tatatap-com/sowhat';
import { createEditor, suggest } from "./lib/index";

////////////////////////
// CONFIGURE EXAMPLES //
////////////////////////

const examples = [
  '!takeout burgers -food:10.95',
  '/budget +income:200',
  '/budget -income:100',
  'http://skiano.com #art #inspiration'
];

///////////////
// UTILITIES //
///////////////

const notesRoot = document.getElementById('notes');
const previewRoot = document.getElementById('preview');
const SPACE_PATTERN = /\s/;
const makeOption = v => ({ display: v, raw: SPACE_PATTERN.test(v) ? `"${v}"` : v });
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

  STATE.notes.forEach(({ parsed }) => {
    let c = folderMap;
    parsed.folder.forEach((f) => {
      const fname = f.value.substring(1);
      if (!fname) return;
      c.children[fname] = c.children[fname] || { label: f.value, notes: [], children: {} };
      c = c.children[fname];
    });
    c.notes.push(parsed.text);

    parsed.event.forEach(({ value }) => {
      eventsMap[value.label] = eventsMap[value.label] || { total: 0, notes: [] };
      eventsMap[value.label].total += 1;
      eventsMap[value.label].notes.push(parsed.text);
    });

    parsed.bean.forEach(({ value }) => {
      beansMap[value.symbol] = beansMap[value.symbol] || { total: 0, notes: [] };
      beansMap[value.symbol].total += parseFloat(value.value) * (value.sign === '+' ? 1 : -1);
      beansMap[value.symbol].notes.push(parsed.text);
    });

    parsed.tag.forEach(({ value }) => {
      tagsMap[value] = tagsMap[value] || [];
      tagsMap[value].push(parsed.text);
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

  const renderTags = (tmap) => {
    return create('div', {}, Object.entries(tmap).map(([tag, notes]) => {
      return create('details', { open: false }, [
        create('summary', {}, `${tag} (${notes.length})`),
        create('div', { class: 'folder-content' }, [
          create('ul', { class: 'folder-note-list' }, notes.map((n) => {
            return create('li', { class: 'folder-note' }, n)
          })),
        ])
      ]);
    }))
  };

  const renderTotals = (totalMap) => {
    return create('div', {},
      Object.entries(totalMap)
        .sort((a, b) => a[0] - b[0])
        .map(([sym, { total, notes }]) => {
          return create('details', { open: false }, [
            create('summary', {}, `${sym} ${total}`),
            create('div', { class: 'folder-content' }, [
              create('ul', { class: 'folder-note-list' }, notes.map((n) => {
                return create('li', { class: 'folder-note' }, n)
              })),
            ])
          ]);
      })
    );
  };

  previewContent.appendChild(create('div', { class: 'ex-dynamic-content' }, [
    create('div', { class: 'preview-section' }, [
      create('h3', { class: 'preview-section-title' }, 'Beans'),
      renderTotals(beansMap),
    ]),
    create('div', { class: 'preview-section' }, [
      create('h3', { class: 'preview-section-title' }, 'Events'),
      renderTotals(eventsMap),
    ]),
    create('div', { class: 'preview-section' }, [
      create('h3', { class: 'preview-section-title' }, 'Tags'),
      renderTags(tagsMap),
    ]),
    create('div', { class: 'preview-section' }, [
      create('h3', { class: 'preview-section-title' }, 'Folders'),
      renderFolderMap(folderMap),
    ]),
  ]));
};

const exampleRoot = create('div', { class: 'ex-examples' });

const addNote = (initialValue) => {
  const note = {};

  const editor = create('div', { class: 'ex-editor' })

  const editorView = createEditor({
    root: editor,
    initialValue,
    onChange: (v) => {
      note.parsed =  sowhat.parse(v);
      console.log(note.parsed);
      updatePreview();
    },
    onFocus: () => {
      updateSuggestions();
    },
    opts: {
      placeholderText: 'Write it down...'
    }
  });

  note.root = create('div', { class: 'ex-wrap'}, [
    editor,
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
  create('h2', { class: 'panel-title' }, 'Current State' ),
  create('div', { class: 'example-panel-content' }, previewContent)
]));

examples.forEach(addNote);
addNote();
