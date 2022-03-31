import './style.css';
import './src/_codemirror.css';

import { StreamLanguage } from "@codemirror/stream-parser";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import { setup } from "./src/setup";
import { states } from './src/soWhatMode';

import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

const sowhatmode = simpleMode(states);

let view = new EditorView({
  state: EditorState.create({
    extensions: [
      setup,
      StreamLanguage.define(sowhatmode)
    ]
  }),
  parent: document.getElementById('app')
});
