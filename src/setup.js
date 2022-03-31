import { EditorState } from '@codemirror/state';
import { EditorView, ViewPlugin, drawSelection, highlightActiveLine, keymap } from '@codemirror/view';
import { HighlightStyle, Tag, tags } from '@codemirror/highlight';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { history, historyKeymap } from '@codemirror/history';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { syntaxTree } from "@codemirror/language";
import { StreamLanguage } from "@codemirror/stream-parser";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import { states, PATH_PATTERN, TAG_PATTERN, BANG_PATTERN, MINUS_PATTERN, PLUS_PATTERN } from './soWhatMode';

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

export default ({ initialValue, root, folders, tagnames, events, beans }) => {
  if (folders) {
    const folderPrompts = [];
    function addFolders(f, parent = '') {
      const label = `${parent}/${f.value}`;
      folderPrompts.push({ label });
      if (f.children) f.children.forEach(f => addFolders(f, label))
    }
    folders.forEach(f => addFolders(f));
    folders = folderPrompts;
  }

  if (events) events = events.map(({ value }) => ({ label: `!${value}` }));
  if (tagnames) tagnames = tagnames.map(({ value }) => ({ label: `#${value}` }));


  let minus;
  let plus;
  if (beans) {
    minus = beans.map(({ value }) => ({ label: `-${value}` }));
    plus = beans.map(({ value }) => ({ label: `+${value}` }));
  }


  function myCompletions(context) {  
    const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  
    if (folders && nodeBefore.name === 'path') {
      return {
        from: nodeBefore.from,
        to: nodeBefore.to,
        span: PATH_PATTERN,
        options: folders,
      }
    }

    if (tagnames && nodeBefore.name === 'tagname') {
      return {
        from: nodeBefore.from,
        to: nodeBefore.to,
        span: TAG_PATTERN,
        options: tagnames,
      }
    }

    if (events && nodeBefore.name === 'bang') {
      return {
        from: nodeBefore.from,
        to: nodeBefore.to,
        span: BANG_PATTERN,
        options: events,
      }
    }

    if (minus && nodeBefore.name === 'minus') {
      return {
        from: nodeBefore.from,
        to: nodeBefore.to,
        span: MINUS_PATTERN,
        options: minus,
      }
    }

    if (plus && nodeBefore.name === 'plus') {
      return {
        from: nodeBefore.from,
        to: nodeBefore.to,
        span: PLUS_PATTERN,
        options: plus,
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

  return new EditorView({
    parent: root,
    state: EditorState.create({
      doc: initialValue,
      extensions: [
        EditorView.theme({
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
          '.cm-error:after': {
            content: '"^ ERROR"',
            whiteSpace: 'nowrap',
            position: 'absolute',
            padding: '3px',
            fontWeight: '700',
            zIndex: '10',
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
          { tag: tags.syntaxerror, class: 'cm-error' },
        ]),
        history(),
        drawSelection(),
        bracketMatching(),
        closeBrackets(),
        autocompletion({ override: [myCompletions] }),
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
