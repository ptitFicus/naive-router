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

function Route({ path, children }) {
  const initRef = useRef({ init: false });
  const [state, setState] = useState(Symbol()); // eslint-disable-line no-unused-vars
  const [displayed, setDisplayed] = useState(false);
  const [params, setParams] = useState({});

  useEffect(() => {
    initRef.current.path = path;
    initRef.current.displayed = displayed;
  }, [path, displayed]);

  useEffect(() => {
    if (!initRef.current.init) {
      const doProxify = proxify(() => {
        const { path, displayed } = initRef.current;
        const { pathname: currentPath } = new URL(window.location.href);
        const matchedRoute = match(path, currentPath);
        if (matchedRoute && !displayed) {
          setDisplayed(true);
          setParams({ ...extractQueryParams(), ...matchedRoute });
        } else if (!matchedRoute && displayed) {
          setDisplayed(false);
        }
      });
      initRef.current.init = true;
      doProxify("pushState");
      doProxify("back");
      doProxify("forward");
      doProxify("go");
      doProxify("replaceState");
      window.addEventListener("popstate", () => setState(Symbol()));
    }
  }, [initRef.current.init, displayed, path]);

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

export { Route };
