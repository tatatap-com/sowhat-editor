import { highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, keymap } from '@codemirror/view';
import { history, historyKeymap } from '@codemirror/history';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { rectangularSelection, crosshairCursor } from '@codemirror/rectangular-selection';
import { defaultHighlightStyle, HighlightStyle, tags, Tag } from '@codemirror/highlight';
import { states } from './soWhatMode';

// SO... we need to tell codemirror about all these tags
// since they do not map to the defaults
// @see https://discuss.codemirror.net/t/codemirror-6-stream-syntax-with-custom-tags/2578/6
const styleTokens = [];
Object.values(states).forEach((state) => {
  if (Array.isArray(state)) {
    state.forEach(({ token }) => {
      if (!tags[token]) {
        tags[token] = Tag.define();
        styleTokens.push(token);
      }
    });
  }
});
const highlightSoWhat = HighlightStyle.define(styleTokens.map((t) => ({ tag: tags[t], class: `cm-${t}` })));

export const setup = [
    highlightSoWhat,
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


