import { syntaxTree } from "@codemirror/language";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import { EditorState } from '@codemirror/state';
import { defaultKeymap } from '@codemirror/commands';
import { StreamLanguage } from "@codemirror/stream-parser";
import { bracketMatching } from '@codemirror/matchbrackets';
import { history, historyKeymap } from '@codemirror/history';
import { HighlightStyle, Tag, tags } from '@codemirror/highlight';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { EditorView, ViewPlugin, drawSelection, keymap } from '@codemirror/view';

import {
  STATES,
  PATH_PATTERN,
  AUTO_COMPLETE_BANG_PATTERN,
  AUTO_COMPLETE_TAG_PATTERN,
  AUTO_COMPLETE_PLUS_PATTERN,
  AUTO_COMPLETE_MINUS_PATTERN,
} from './constants';

////////////////////////
// AUTO COMPLETE MGMT //
////////////////////////

const suggestions = {
  tag: new Set(),
  plus: new Set(),
  minus: new Set(),
  event: new Set(),
  folder: new Set(),
}

function addFolders(f, parent = '') {
  const label = `${parent}/${f.value}`;
  suggestions.folder.add(label)
  if (f.children) f.children.forEach(f => addFolders(f, label))
}

export const addSuggestion = (type, sug) => {
  if (Array.isArray(sug)) return sug.forEach(s => addSuggestion(type, s));

  switch (type) {
    case 'folder':
      addFolders(sug);
      break;
    case 'tag':
      suggestions.tag.add(`#${sug.value}`);
      break;
    case 'event': 
      suggestions.tag.add(`!${sug.value}`);
      break;
    case 'bean': 
      suggestions.plus.add(`+${sug.value}`);
      suggestions.minus.add(`-${sug.value}`);
      break;
    default:
      throw new Error(`Bad suggestion type: ${type}`);
  }
}

export const removeSuggestion = (type, sug) => {
  // TODO...
}

///////////////////////////////
// CODE MIRROR CONFIGURATION //
///////////////////////////////

// SO... we need to tell codemirror about all these tags
// since our tags do not map to the defaults provided
// @see https://discuss.codemirror.net/t/codemirror-6-stream-syntax-with-custom-tags/2578/6
Object.values(STATES).forEach((state) => {
  if (Array.isArray(state)) {
    state.forEach(({ token }) => {
      if (!tags[token]) {
        tags[token] = Tag.define();
      }
    });
  }
});

const completions = [
  ['path', PATH_PATTERN, suggestions.folder],
  ['bang', AUTO_COMPLETE_BANG_PATTERN, suggestions.event],
  ['tagname', AUTO_COMPLETE_TAG_PATTERN, suggestions.tag],
  ['plus', AUTO_COMPLETE_PLUS_PATTERN, suggestions.bean],
  ['minus', AUTO_COMPLETE_MINUS_PATTERN, suggestions.bean],
];

function suggestTokens(context) {  
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);

  for (let i = 0; i < completions.length; i++) {
    const [targetNode, matchPattern, options] = completions[i];
    if (
      (targetNode !== 'path' && nodeBefore.name === 'word' && context.matchBefore(matchPattern)) ||
      (nodeBefore.name === targetNode)
    ) {
      const word = context.matchBefore(matchPattern);
      return {
        from: nodeBefore.name === targetNode ? nodeBefore.from : word.from,
        to: nodeBefore.name === targetNode ? nodeBefore.to : word.to,
        span: matchPattern,
        options: Array.from(options).map(o => ({ label: o })),
      }
    }
  }
  return null;
}

const tokenish = {
  borderRadius: '2px',
  display: 'inline-block',
  padding: '0 3px 0',
  fontWeight: '700',
};

const extensions = [
  EditorView.lineWrapping,
  EditorView.theme({
    '&.cm-editor': {
      padding: '6px',
      background: '#fff',
      boxShadow: '2px 2px 0px rgb(0 0 0 / 15%)',
      fontFamily: `'Overpass Mono', monospace`,
      fontSize: '16px',
    },
    '&.cm-editor.cm-focused': {
      outline: '1px solid #0e62d1',
    },
    '.cm-selectionBackground': {
      background: 'rgba(0, 200, 0, 0.3) !important',
    },
    '.cm-completionIcon': {
      display: 'none',
    },
    '.cm-tooltip': {
      background: '#fff',
      border: '1px solid #ddd',
      boxShadow: '3px 2px 18px -5px rgba(0,0,0,0.1)'
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li': {
      padding: '4px 6px',
      color: 'rgba(0, 0, 0, 0.4)',
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      background: 'rgba(0, 200, 0, 0.4)',
    },
    '.cm-completionMatchedText': {
      color: 'rgba(0, 0, 0, 1)',
      textDecoration: 'none',
    },
  }),
  HighlightStyle.define([
    { tag: tags.date, color: '#ac6e65', fontWeight: '700' },
    { tag: tags.pin, color: '#0e62d1', fontWeight: '700' },
    { tag: tags.path, fontWeight: '700', background: '#f3ca20', ...tokenish  },
    { tag: tags.tagname, color: '#11a7d1' },
    { tag: tags.plus, color: '#57bb1e', fontWeight: '700' },
    { tag: tags.minus, color: '#ff776d', fontWeight: '700' },
    { tag: tags.bang, color: '#ee8826', fontWeight: '700' },
    { tag: tags.todo, color: '#fff', background: '#cb1c17', ...tokenish },
    { tag: tags.done, color: '#fff', background: '#57bb1e', ...tokenish },
    { tag: tags.url, color: '#6090cb', fontWeight: '700' },
    { tag: tags['formula-open'], color: '#0e62d1', fontWeight: '700' },
    { tag: tags.arg, color: '#0e62d1' },
    { tag: tags.arg, color: '#0e62d1' },
    { tag: tags.operator, color: '#7a6fa4' },
    { tag: [tags.lparen, tags.rparen], color: '#7a6fa4' },
    { tag: tags.syntaxerror, color: 'red', textDecoration: 'red wavy underline' },
  ]),
  history(),
  drawSelection(),
  bracketMatching(),
  closeBrackets(),
  autocompletion({ override: [suggestTokens] }),
  keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...completionKeymap
  ]),
  StreamLanguage.define(simpleMode(STATES)),
];

/////////////////////
// EDITOR CREATION //
/////////////////////

export default ({ initialValue, root, onChange }) => {
  const view = new EditorView({
    parent: root,
    state: EditorState.create({
      doc: initialValue,
      extensions: [
        extensions,
        ViewPlugin.fromClass(class {
          update(update) {
            if (onChange && update.docChanged) {
              onChange(update.state.doc.toString());
            }
          }
        })
      ],
    }),
  });

  // Initial value calls change handler...
  if (onChange) {
    onChange(view.viewState.state.doc.toString());
  }

  // pass back the underlying editor...
  return view;
};
