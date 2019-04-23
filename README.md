# naive-router

[![Build Status](https://travis-ci.com/ptitFicus/naive-router.svg?branch=master)](https://travis-ci.com/ptitFicus/naive-router)
[![Coverage Status](https://coveralls.io/repos/github/ptitFicus/naive-router/badge.svg?branch=coveralls)](https://coveralls.io/github/ptitFicus/naive-router?branch=coveralls)

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

- It alterates the global `window` object by adding it a new property. However, since this property is defined using `Symbol()`, collision is impossible.
- It also monkeypatch `window.history` methods : `pushState`, `go`, `back`, `replaceState` and `forward` to broadcats any location change to every `Route` component.
- Several `Route` components could match a given url (for instance both `/foo/bar` and `/foo/{id}` match route `/foo/bar`). You should think aboute the `Route` component as a conditionnal display of its children based on the route.
- Since path params and query params are passed directly as props to child components, there is a risk of name conflict. The priority order is : 1) path params 2) query params 3) props

## Features

- [x] Route matching
- [x] Path parameters support
- [x] Query parameters support
