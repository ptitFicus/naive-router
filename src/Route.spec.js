import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import Route from "./Route";

test("should not display component when route is not matched", () => {
  const Child = () => <div>Child</div>;
  const renderedRoute = TestRenderer.create(
    <Route path="/foo">
      <Child />
    </Route>
  );

  const testInstance = renderedRoute.root;
  expect(() => testInstance.findByType(Child)).toThrow();
});

test("should display component when route is matched", () => {
  const Child = () => <div>Child</div>;
  const renderedRoute = TestRenderer.create(
    <Route path="/foo">
      <Child />
    </Route>
  );

  act(() => {
    window.history.pushState({}, null, "/foo");
  });

  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(Child)).toBeTruthy();
});

test("should display component with correct props when route is matched", () => {
  const Child = () => <div>Child</div>;
  const renderedRoute = TestRenderer.create(
    <Route path="/foo/{id}/{name}">
      <Child />
    </Route>
  );

  act(() => {
    window.history.pushState({}, null, "/foo/1/test");
  });

  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(Child).props).toEqual({
    id: "1",
    name: "test"
  });
});
