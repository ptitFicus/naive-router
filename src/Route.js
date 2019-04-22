import React, { useState, useRef, useEffect } from "react";
import match from "./matcher/index.js";

function Route({ path, children }) {
  const initRef = useRef({ init: false });
  const setState = useState(Symbol())[1];

  if (!initRef.current.init) {
    const doProxify = proxify(() => setState(Symbol()));
    initRef.current.init = true;
    doProxify("pushState");
    doProxify("back");
    doProxify("forward");
    doProxify("go");
    doProxify("replaceState");
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

const proxify = callback => name => {
  const callbackSymbol = Symbol();
  window.history[callbackSymbol] = window.history[name];
  window.history[name] = (...args) => {
    window.history[callbackSymbol](...args);
    callback();
  };
};

export default Route;
