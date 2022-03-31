import './style.css';
import setup from "./src/setup";

setup({
  root: document.getElementById('app'),
  folders: [
    '/notes',
    '/work',
    '/work/todos',
  ],
  tagnames: [
    '#ideas',
    '#nice'
  ]
})
