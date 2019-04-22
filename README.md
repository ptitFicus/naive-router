# naive-router

Super naive dependency free router for React

## Usage

This library expose a single `Route` component that will display its children if an only if its prop `path` is matched by the current browser route.

### Route matching without parameters

```jsx
<Route path="/foo/bar">
  <div>Matched /foo/bar route</div>
</Route>
```

### Route matching with path paremeters

```jsx
const Child = ({id}) => <div>Matched route "/foo/{id}" with {id}</div>
<Route path="/foo/{id}">
  <Child />
</Route>
```

## Pitfall

This libray comes with some pitfalls :

- It alterates the global `window` object by defining new properties. However, since these properties are defined using `Symbol()`, collision is impossible.
- Several `Route` components could match a given url (for instance both `/foo/bar` and `/foo/{id}` match route `/foo/bar`). You should think aboute the `Route` component as a conditionnal display of its children based on the route.

## Features

- [x] Route matching
- [x] Path parameters support
- [x] Query parameters support
