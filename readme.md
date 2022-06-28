# Sowhat Editor

```bash
$ npm run dev # develop the library
$ npm run build # builds the demo page and a UMD bundle that should be useable in the browser
```

## Usage

```javascript
import { createEditor, suggest } from '@tatatap-com/sowhat-editor';

// You can set the folders for autocompletion like so...

suggest('folder', [
  {
    raw: 'foo',
    children: [
      { raw: 'bar' }
    ]
  }
]);

suggest('bean', [
  { raw: 'income' },
  { raw: 'expense' },
]);

suggest('event', [
  { raw: 'takeout' },
  { raw: 'headache' },
]);

suggest('tag', [
  { raw: 'inspiration' },
  { raw: '"want it"' },
]);

// You can create an editor in a dom element like so...

createEditor({
  root: document.getElementById('fancy-editor'),
  initialValue: 'An initial note!',
  onChange: (txt) => { // this also fires immediately...
    console.log(txt);
  },
  onFocus: () => {},
  onBlur: () => {},
});
```
