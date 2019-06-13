import React, { useRef, useState, useEffect } from 'react';

/**
 * @param  {string} pathPattern pattern to match
 * @param  {string} path path to test against pathPattern
 * @returns {(boolean|object)} either false if path doesn't match pathPattern,
 * or an object containing valued path parameters of the route
 */
function match(pathPattern, path) {
  const patternParts = extractParts(pathPattern);
  const pathParts = extractParts(path);

  if (patternParts.length !== pathParts.length) {
    return false;
  }

  const absolutePartMatch = patternParts
    .map((patternPart, index) => {
      if (isVariable(patternPart)) {
        return true;
      }
      return patternPart === pathParts[index];
    })
    .reduce((acc, next) => acc && next, true);

  if (!absolutePartMatch) {
    return false;
  }

  return pathParts
    .map((part, index) => {
      if (isVariable(patternParts[index])) {
        return [[patternParts[index].replace(/{|}/g, "")], part];
      }

      return null;
    })
    .filter(res => res !== null)
    .reduce((curr, [key, value]) => {
      curr[key] = value;
      return curr;
    }, {});
}

function isVariable(pathPart) {
  return pathPart.startsWith("{");
}

function extractParts(path) {
  return path.split("/").filter(str => str.length > 0);
}

class EventQueue {
  constructor() {
    this.queue = [];
  }

  suscribe(callback) {
    this.queue.push(callback);
  }

  unsuscribe(callback) {
    const index = this.queue.indexOf(callback);
    if (index === -1) {
      return;
    }
    this.queue.splice(index, 1);
  }

  broadcast() {
    this.queue.forEach(callback => callback());
  }
}

const monkeyPatchSymbol = Symbol();

function Route({ path, children }) {
  const ref = useRef({});
  const [displayed, setDisplayed] = useState(false);
  const [queryParams, setQueryParams] = useState({});
  const [pathParams, setPathParams] = useState({});

  useEffect(() => {
    ref.current.path = path;
    ref.current.displayed = displayed;
  }, [path, displayed]);

  useEffect(() => {
    if (!window[monkeyPatchSymbol]) {
      window[monkeyPatchSymbol] = new EventQueue();

      const doProxify = proxify(() => window[monkeyPatchSymbol].broadcast());

      doProxify("pushState");
      doProxify("back");
      doProxify("forward");
      doProxify("go");
      doProxify("replaceState");
    }

    const updateCallback = () => {
      const { path, displayed } = ref.current;
      const { pathname: currentPath } = new URL(window.location.href);
      const matchedRoute = match(path, currentPath);
      if (matchedRoute && !displayed) {
        setDisplayed(true);
        setQueryParams(extractQueryParams());
        setPathParams(matchedRoute);
      } else if (!matchedRoute && displayed) {
        setDisplayed(false);
      }
    };

    window[monkeyPatchSymbol].suscribe(updateCallback);
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

export { Route };
