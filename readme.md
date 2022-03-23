# Codemirror6 editor setup

https://codemirror.net/6/

## Things needed 

find the codemirror base styles


here:?

`import 'codemirror/lib/codemirror.css';`

given a list like 

```const tags = [{
name: 'Foo Bar'
value: '"Foo Bar"'
}]

```

when a person types into the editor

`hello this is a #`

The typing of the '#' character should open a flyout menu that allows the person to select from one of the pre-defined tags in the tags array.

There will be separate lists with the same format for: folders, beans and events.

Folders function different than the other types. they will have an possible third property `children`

ie

```
const folders = [{
name: 'Baz Qux',
value: '"Baz Qux"',
children: [{
name: 'more here'
value: '"more here"'
}]
}]
```

### A note on 'value' and 'name'

"name" is the display name of the token, "value" is the actual name of the token. Any token with spaces in the name needs quotes surrounding it in the "value".

It is possible for a name and value to be the same ie

```
{name: 'foo', value: 'foo'}
```

There is no whitespace or capitalization so a quoteless value is OK


integrating the legacy mode
https://github.com/codemirror/legacy-modes

```
import {StreamLanguage} from "@codemirror/stream-parser"
import {simpleMode} from "@codemirror/legacy-modes/mode/simple-mode"

import {EditorView, EditorState, basicSetup} from "@codemirror/basic-setup"

import {states} from './soWhatMode'

const sowhatmode = simpleMode(states)

let view = new EditorView({
  state: EditorState.create({
    extensions: [basicSetup, StreamLanguage.define(sowhatmode)]
  })
})
```
