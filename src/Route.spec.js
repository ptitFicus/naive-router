import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import Route from "./Route";

test("should not display component when route is not matched", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/bar");

  childShouldBeAbsent(renderedRoute);
});

test("should display component when route is matched", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/foo");

  childShouldBePresent(renderedRoute);
});

test("should display component with correct props when route is matched", () => {
  const renderedRoute = renderRouteWithPath("/foo/{id}/{name}");

  routeTo("/foo/1/test");

  childShouldHaveProps(renderedRoute, {
    id: "1",
    name: "test"
  });
});

test("should pass query paremeters", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/foo?id=1");

  childShouldHaveProps(renderedRoute, {
    id: "1"
  });
});

test("path params should prevail over query param ", () => {
  const renderedRoute = renderRouteWithPath("/foo/{id}");

  routeTo("/foo/bar?id=1");

  childShouldHaveProps(renderedRoute, {
    id: "bar"
  });
});

test("should hide component when route is matched then unmatched", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/foo");
  childShouldBePresent(renderedRoute);
  routeTo("/lol");
  childShouldBeAbsent(renderedRoute);
});

test("should hide component when route is matched brefore back() is called", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/lol");
  childShouldBeAbsent(renderedRoute);
  routeTo("/foo");
  childShouldBePresent(renderedRoute);
});

function routeTo(path) {
  act(() => {
    window.history.pushState({}, null, path);
  });
}

function childShouldHaveProps(renderedRoute, props) {
  childShouldBePresent(renderedRoute);
  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(Child).props).toEqual(props);
}

function childShouldBePresent(renderedRoute) {
  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(Child)).toBeTruthy();
}

function childShouldBeAbsent(renderedRoute) {
  const testInstance = renderedRoute.root;
  expect(() => testInstance.findByType(Child)).toThrow();
}

function Child() {
  return <div>Child</div>;
}

function renderRouteWithPath(path) {
  let renderedRoute;
  act(() => {
    renderedRoute = TestRenderer.create(
      <Route path={path}>
        <Child />
      </Route>
    );
  });
  return renderedRoute;
}
