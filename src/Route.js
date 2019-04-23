import React, { useState, useRef, useEffect } from "react";
import match from "./matcher/index.js";

const monkeyPatchSymbol = Symbol();

function Route({ path, children }) {
  const ref = useRef({});
  const [displayed, setDisplayed] = useState(false);
  const [params, setParams] = useState({});

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
        setParams({ ...extractQueryParams(), ...matchedRoute });
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

const proxify = callback => name => {
  const callbackSymbol = Symbol();
  window.history[callbackSymbol] = window.history[name];
  window.history[name] = (...args) => {
    window.history[callbackSymbol](...args);
    callback();
  };
};

export default Route;
