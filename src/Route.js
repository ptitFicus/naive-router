import React, { useState, useRef, useEffect } from "react";
import match from "./matcher/index.js";

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
      const updateCallback = () => {
        const { path, displayed } = initRef.current;
        const { pathname: currentPath } = new URL(window.location.href);
        const matchedRoute = match(path, currentPath);
        if (matchedRoute && !displayed) {
          setDisplayed(true);
          setParams({ ...extractQueryParams(), ...matchedRoute });
        } else if (!matchedRoute && displayed) {
          setDisplayed(false);
        }
      };
      const doProxify = proxify(updateCallback);
      initRef.current.init = true;
      doProxify("pushState");
      doProxify("back");
      doProxify("forward");
      doProxify("go");
      doProxify("replaceState");
      window.addEventListener("popstate", updateCallback);
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

export default Route;
