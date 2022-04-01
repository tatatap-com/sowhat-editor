# Sowhat editor

```bash
$ npm run dev # develop the library
$ npm run build # builds the demo page and a UMD bundle that should be useable in the browser
```

# usage

```javascript
import { createEditor, suggest } from '@tatatap-com/sowhat-editor';

// You can set the folders for autocompletion like so...

suggest('folder', [
  {
    value: 'foo',
    children: [
      { value: 'bar' }
    ]
  }
]);

suggest('bean', [
  { value: 'income' },
  { value: 'expense' },
]);

suggest('event', [
  { value: 'takeout' },
  { value: 'headache' },
]);

suggest('tag', [
  { value: 'inspiration' },
  { value: '"want it"' },
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
