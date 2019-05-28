# naive-router

[![npm version](https://badge.fury.io/js/naive-router.svg)](https://badge.fury.io/js/naive-router)
[![Build Status](https://travis-ci.com/ptitFicus/naive-router.svg?branch=master)](https://travis-ci.com/ptitFicus/naive-router)
[![Coverage Status](https://coveralls.io/repos/github/ptitFicus/naive-router/badge.svg?branch=master)](https://coveralls.io/github/ptitFicus/naive-router?branch=master)

Super naive dependency free router for React

## Usage

This library expose a single `Route` component.

A `Route` will display its children if an only current browser route matches its `path` prop.

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

## Pitfalls

This library comes with some pitfalls :

- It add a new property to the  the global `window` object. But, since this property key is a `Symbol()`, collision is impossible.
- It also monkey-patch `window.history` methods : `pushState`, `go`, `back`, `replaceState` and `forward` to broadcats any location change to every `Route` component.
- `Route` components pass path and query  parameters as props to child components. Thus there is a risk of name conflict. The priority order is : 1) path  parameters 2) query  parameters 3) props
- Several `Route` components could match a given url (for instance both `/foo/bar` and `/foo/{id}` match route `/foo/bar`). You should think about the `Route` component as a conditional display of its children based on the route.
- It's currently not possible to display a default component when no no route is  matched. Thus a 404 Route is not possible.

## Features

- [x] Route matching
- [x] Path parameters support
- [x] Query parameters support
- [ ] 404 Route
