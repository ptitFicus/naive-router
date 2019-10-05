import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Route, NotFound } from "./Route";

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

test("params update should trigger component update", () => {
  const renderedRoute = renderRouteWithPath("/foo");

  routeTo("/foo?name=aaa");
  expect(renderedRoute.root.findByType("div").children[0]).toBe("aaa");
  routeTo("/foo?name=bbb");
  expect(renderedRoute.root.findByType("div").children[0]).toBe("bbb");
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

test("should pass all props when render function is used as a child", () => {
  const renderFunc = jest
    .fn()
    .mockImplementation(() => <div>Hello render prop</div>);
  renderFunctionChildWithPath(renderFunc, "/foo/{name}");

  routeTo("/foo/pathName?name=queryName");
  expect(renderFunc).toHaveBeenCalledWith(
    { name: "pathName" },
    { name: "queryName" }
  );
});

test("should display NotFound route if path is not found", () => {
  const rendered = renderRouteAndNotFoundRoot("/foo");

  routeTo("/lol");
  childShouldBeAbsent(rendered);
  notFoundChildShouldBePresent(rendered);
});

test("should not display NotFound route if path is found", () => {
  const rendered = renderRouteAndNotFoundRoot("/foo");

  routeTo("/foo");
  notFoundChildShouldBeAbsent(rendered);
  childShouldBePresent(rendered);
});

test("should hide NotFound route as soon as another route is matched", () => {
  const rendered = renderRouteAndNotFoundRoot("/foo");

  routeTo("/lol");
  childShouldBeAbsent(rendered);
  notFoundChildShouldBePresent(rendered);
  routeTo("/foo");
  notFoundChildShouldBeAbsent(rendered);
  childShouldBePresent(rendered);
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

function notFoundChildShouldBePresent(renderedRoute) {
  const testInstance = renderedRoute.root;
  expect(testInstance.findByType(NotFoundChild)).toBeTruthy();
}

function childShouldBeAbsent(renderedRoute) {
  const testInstance = renderedRoute.root;
  expect(() => testInstance.findByType(Child)).toThrow();
}

function notFoundChildShouldBeAbsent(renderedRoute) {
  const testInstance = renderedRoute.root;
  expect(() => testInstance.findByType(NotFoundChild)).toThrow();
}

function Child({ name }) {
  return <div>{name}</div>;
}

function NotFoundChild() {
  return <div>Not found</div>;
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

function renderRouteAndNotFoundRoot(path) {
  let renderedRoute;
  act(() => {
    renderedRoute = TestRenderer.create(
      <>
        <Route path={path}>
          <Child />
        </Route>
        <NotFound>
          <NotFoundChild />
        </NotFound>
      </>
    );
  });
  return renderedRoute;
}

function renderFunctionChildWithPath(func, path) {
  let renderedRoute;
  act(() => {
    renderedRoute = TestRenderer.create(<Route path={path}>{func}</Route>);
  });
  return renderedRoute;
}
