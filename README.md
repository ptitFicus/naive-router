# naive-router

[![npm version](https://badge.fury.io/js/naive-router.svg)](https://badge.fury.io/js/naive-router)
[![Build Status](https://travis-ci.com/ptitFicus/naive-router.svg?branch=master)](https://travis-ci.com/ptitFicus/naive-router)
[![Coverage Status](https://coveralls.io/repos/github/ptitFicus/naive-router/badge.svg?branch=master)](https://coveralls.io/github/ptitFicus/naive-router?branch=master) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/naive-router.svg)](https://bundlephobia.com/result?p=naive-router)

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

### Route with render function as a child

Child of the route component can be a render function.
This function will be invoked with two arguments : path and query parameters.

```jsx
const Child = ({id}) => <div>Matched route "/foo/{id}" with {id}</div>
<Route path="/foo/{id}">
  {(pathParameters, queryParemeters) => <div>{pathParameters.id} {queryParameters.id}</div>}
</Route>
```

### NotFound route

It's possible to display a special route when no `Route` component has been matched.

```jsx
const Child = ({id}) => <div>Matched route "/foo/{id}" with {id}</div>
<>
  <Route path="/foo/{id}">
    {(pathParameters, queryParemeters) => <div>{pathParameters.id} {queryParameters.id}</div>}
  </Route>
  <NotFound>
    <div>Not found !</div>
  </NotFound>
</>
```

As for `Route` component, it's possible to have more than one `NotFound` component.
Each one of them will be display when no `Route` is matched.

## Pitfalls

This library comes with some pitfalls :

- It add a new property to the the global `window` object. But, since this property key is a `Symbol()`, collision is impossible.
- It also monkey-patch `window.history` methods : `pushState`, `go`, `back`, `replaceState` and `forward` to broadcats any location change to every `Route` component.
- `Route` components pass path and query parameters as props to child components. Thus there is a risk of name conflict. The priority order is : 1) path parameters 2) query parameters 3) props. Passing a render function as a children to the Route component solve this issue.
- Several `Route` components could match a given url (for instance both `/foo/bar` matches routes `/foo/bar` **and** `/foo/{id}`). You should think about the `Route` component as a conditional display of its children based on the route.

## Features

- [x] Route matching
- [x] Path parameters support
- [x] Query parameters support
- [x] 404 Route
