@parent <%= app %>
@module {React.Component} <%= module %> <<%= tag %> />

A short description of the tag component

@signature `<<%= tag %> />`

@body

## Use

```js
import Component from 'react'
import <%= tag %> from '<%= module %>/'

export default class <%= tag %> extends Component {
  render () {
    return (
      <<%= tag %> />
    )
  }
}
```
