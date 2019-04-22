import React, { useState, useRef, useEffect } from "react";
import match from "./matcher/index.js";

function Route({ path, children }) {
  const initRef = useRef({ init: false });
  const setState = useState(Symbol())[1];

  if (!initRef.current.init) {
    initRef.current.init = true;
    const callbackSymbol = Symbol();
    window.history[callbackSymbol] = window.history.pushState;
    window.history.pushState = (...args) => {
      window.history[callbackSymbol](...args);
      // Trigger repaint
      setState(Symbol());
    };
  }

  const [displayed, setDisplayed] = useState(false);
  const [params, setParams] = useState({});

  const { pathname: currentPath } = new URL(window.location.href);

  useEffect(() => {
    const matchedRoute = match(path, currentPath);
    if (matchedRoute) {
      setDisplayed(true);
      setParams({ ...extractQueryParams(), ...matchedRoute });
    } else {
      setDisplayed(false);
    }
  }, [currentPath, path]);

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

export default Route;
