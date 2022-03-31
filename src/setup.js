import { EditorView } from '@codemirror/view';
import { highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, keymap } from '@codemirror/view';
import { history, historyKeymap } from '@codemirror/history';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { rectangularSelection, crosshairCursor } from '@codemirror/rectangular-selection';
import { HighlightStyle, tags, Tag } from '@codemirror/highlight';
import { states } from './soWhatMode';

// SO... we need to tell codemirror about all these tags
// since they do not map to the defaults
// @see https://discuss.codemirror.net/t/codemirror-6-stream-syntax-with-custom-tags/2578/6
Object.values(states).forEach((state) => {
  if (Array.isArray(state)) {
    state.forEach(({ token }) => {
      if (!tags[token]) {
        tags[token] = Tag.define();
      }
    });
  }
});

const tokenish = {
  borderRadius: '2px',
  display: 'inline-block',
  padding: '0px 3px 0px',
  fontWeight: '700',
}

export const setup = [
    EditorView.theme({
      '.cm-editor': {
        border: '1px solid #fff',
        padding: '6px',
        borderRadius: '4px',
      },
      '.cm-content': {
        fontFamily: `'Overpass Mono', monospace`,
        fontSize: '16px',
        lineHeight: 1.75,
        wordBreak: 'break-word',
      },
      '.cm-error': {
        color: 'darkred',
        fontWeight: '700',
        position: 'relative',
      },
      '.cm-error:before': {
        content: '^ ERROR',
        whiteSpace: 'nowrap',
        position: 'absolute',
        padding: '3px',
        fontWeight: '700',
        zIndex: '2',
        fontSize: '9px',
        top: '100%',
        left: '0px',
      }
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
      { tag: tags.error, class: 'cm-error' },
    ]),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...completionKeymap
    ]),
];


