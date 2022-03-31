import { EditorState } from '@codemirror/state';
import { EditorView, ViewPlugin, drawSelection, highlightActiveLine, keymap } from '@codemirror/view';
import { HighlightStyle, Tag, tags } from '@codemirror/highlight';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { history, historyKeymap } from '@codemirror/history';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { rectangularSelection, crosshairCursor } from '@codemirror/rectangular-selection';
import { syntaxTree } from "@codemirror/language"
import { StreamLanguage } from "@codemirror/stream-parser";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
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

export default ({ root, folders, tagnames }) => {

  // create proper completion options
  if (folders) folders = folders.map(label => ({ label }));
  if (tagnames) tagnames = tagnames.map(label => ({ label }));

  function myCompletions(context) {  
    const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  
    // TODO: should we start autocomplete before a letter
    // if (nodeBefore.name === 'word' && context.matchBefore(/^\//)) {
    //   console.log('maybe a folder...');
    // }
  
    if (folders && nodeBefore.name === 'path') {
      return {
        from: nodeBefore.from,
        to: nodeBefore.to,
        span: /^\S*/,
        options: folders,
      }
    }

    if (tagnames && nodeBefore.name === 'tagname') {
      return {
        from: nodeBefore.from,
        to: nodeBefore.to,
        span: /^\S*/,
        options: tagnames,
      }
    }
  
    return null;
  }

  const tokenish = {
    borderRadius: '2px',
    display: 'inline-block',
    padding: '0px 3px 0px',
    fontWeight: '700',
  }  

  let view = new EditorView({
    parent: root,
    state: EditorState.create({
      extensions: [
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
        history(),
        drawSelection(),
        bracketMatching(),
        closeBrackets(),
        autocompletion({ override: [myCompletions] }),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...completionKeymap
        ]),
        StreamLanguage.define(simpleMode(states)),
        ViewPlugin.fromClass(class {
          update(update) {
            if (update.docChanged) {
              console.log(update.state.doc.toString());
            }
          }
        })
      ],
    }),
  });
};
