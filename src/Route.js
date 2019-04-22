import React, { useState, useRef } from "react";
import useUrl from "./useUrl";
import match from "./matcher/index.js";

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

export default Route;
