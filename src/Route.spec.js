import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import Route from "./Route";

test("should not display component when route is not matched", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/bar");

  const testInstance = renderedRoute.root;
  expect(() => testInstance.findByType(Child)).toThrow();
});

test("should display component when route is matched", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/foo");

  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(Child)).toBeTruthy();
});

test("should display component with correct props when route is matched", () => {
  const renderedRoute = renderRouteWithPath("/foo/{id}/{name}");

  routeTo("/foo/1/test");

  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(Child).props).toEqual({
    id: "1",
    name: "test"
  });
});

test("should pass query paremeters", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/foo?id=1");

  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(Child).props).toEqual({
    id: "1"
  });
});

test("path params should prevail over query param ", () => {
  const renderedRoute = renderRouteWithPath("/foo/{id}");

  routeTo("/foo/bar?id=1");

  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(Child).props).toEqual({
    id: "bar"
  });
});

function routeTo(path) {
  act(() => {
    window.history.pushState({}, null, path);
  });
}

function Child() {
  return <div>Child</div>;
}

function renderRouteWithPath(path) {
  routeTo("/");
  return TestRenderer.create(
    <Route path={path}>
      <Child />
    </Route>
  );
}
