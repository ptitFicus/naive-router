import React, { useState, useRef } from 'react';

function useUrl(onChange) {
  let { pathname: newPath } = new URL(window.location.href);

  const [currentPath, setUrl] = useState(undefined);

  if (newPath !== currentPath) {
    setUrl(newPath);
    onChange(newPath);
  }
}

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
  const useStateResult = useState(Symbol());

  if (!initRef.current.init) {
    initRef.current.init = true;
    const callbackSymbol = Symbol();
    window.history[callbackSymbol] = window.history.pushState;
    window.history.pushState = (...args) => {
      window.history[callbackSymbol](...args);
      useStateResult[1](Symbol());
    };
  }

  const [displayed, setDisplayed] = useState(false);
  const [params, setParams] = useState({});
  useUrl(newPath => {
    const matchedRoute = match(path, newPath);
    if (matchedRoute) {
      setDisplayed(true);
      setParams({ ...extractQueryParams(), ...matchedRoute });
    } else {
      setDisplayed(false);
    }
  });

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

export { Route };
