import React, { useState, useRef, useEffect } from "react";
import match from "./matcher/index.js";
import queue from "./EventQueue";

function routeFactory(notFound) {
  return function({ path, children }) {
    const ref = useRef({});
    const [{ displayed, queryParams, pathParams }, setDisplayInfo] = useState({
      displayed: false
    });

    useEffect(() => {
      ref.current.path = path;
      ref.current.displayed = displayed;
    }, [path, displayed]);

    useEffect(() => {
      const updateCallback = anotherRouteMatched => {
        let matchedRoute = false;
        const { path, displayed } = ref.current;
        if (notFound) {
          matchedRoute = !anotherRouteMatched;
        } else {
          const { pathname: currentPath } = new URL(window.location.href);
          matchedRoute = match(path, currentPath);
        }

        if (matchedRoute) {
          setDisplayInfo({
            displayed: true,
            queryParams: extractQueryParams(),
            pathParams: matchedRoute
          });
        } else if (!matchedRoute && displayed) {
          setDisplayInfo({ displayed: false });
        }
        return !!matchedRoute;
      };

      if (notFound) {
        queue.suscribeNotFound(updateCallback);
      } else {
        queue.suscribe(updateCallback);
      }

      return () => {
        queue.unsuscribe(updateCallback);
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

const getTypeOf = something => {
  const getType = {};
  return something && getType.toString.call(something);
};

const isFunction = functionToCheck => {
  const type = getTypeOf(functionToCheck);
  return type && type === "[object Function]";
};

const Route = routeFactory(false);
Route.displayName = "Route";
const NotFound = routeFactory(true);
NotFound.displayName = "NotFound";

export { Route, NotFound };
