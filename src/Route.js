import React, { useState, useRef, useEffect } from "react";
import match from "./matcher/index.js";
import EventQueue from "./EventQueue";

const monkeyPatchSymbol = Symbol();

function routeFactory(notFound) {
  return function Route({ path, children }) {
    const ref = useRef({});
    const [displayed, setDisplayed] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const [pathParams, setPathParams] = useState({});

    useEffect(() => {
      ref.current.path = path;
      ref.current.displayed = displayed;
    }, [path, displayed]);

    useEffect(() => {
      setupIfNeeded();

      const updateCallback = anotherRouteMatched => {
        let matchedRoute = false;
        const { path, displayed } = ref.current;
        if (notFound) {
          matchedRoute = !anotherRouteMatched;
        } else {
          const { pathname: currentPath } = new URL(window.location.href);
          matchedRoute = match(path, currentPath);
        }

        if (matchedRoute && !displayed) {
          setDisplayed(true);
          setQueryParams(extractQueryParams());
          setPathParams(matchedRoute);
        } else if (!matchedRoute && displayed) {
          setDisplayed(false);
        }
        return !!matchedRoute;
      };

      if (notFound) {
        window[monkeyPatchSymbol].suscribeNotFound(updateCallback);
      } else {
        window[monkeyPatchSymbol].suscribe(updateCallback);
      }

      window.addEventListener("popstate", updateCallback);
      updateCallback();
      return () => {
        window[monkeyPatchSymbol].unsuscribe(updateCallback);
        window.removeEventListener("popstate", updateCallback);
      };
    }, []);

    if (isFunction(children)) {
      return displayed ? children(pathParams, queryParams) : null;
    }

    const params = { ...queryParams, ...pathParams };
    return displayed
      ? React.Children.map(children, child => React.cloneElement(child, params))
      : null;
  };
}

function extractQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const res = {};
  for (const [key, value] of params.entries()) {
    res[key] = value;
  }

  return res;
}

const proxify = callback => name => {
  const callbackSymbol = Symbol();
  window.history[callbackSymbol] = window.history[name];
  window.history[name] = (...args) => {
    window.history[callbackSymbol](...args);
    callback();
  };
};

const getTypeOf = something => {
  const getType = {};
  return something && getType.toString.call(something);
};

const isFunction = functionToCheck => {
  const type = getTypeOf(functionToCheck);
  return type && type === "[object Function]";
};

const setupIfNeeded = () => {
  if (!window[monkeyPatchSymbol]) {
    window[monkeyPatchSymbol] = new EventQueue();

    const doProxify = proxify(() => window[monkeyPatchSymbol].broadcast());

    doProxify("pushState");
    doProxify("back");
    doProxify("forward");
    doProxify("go");
    doProxify("replaceState");
  }
};

const Route = routeFactory(false);
const NotFound = routeFactory(true);

export { monkeyPatchSymbol, Route, NotFound };
