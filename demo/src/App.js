import React from "react";
import { Route, NotFound } from "naive-router";

function PathParamExemple({ id }) {
  return <div>Path parameter: id={id}</div>;
}

function QueryParamExemple({ name }) {
  return <div>Query parameter: name={name}</div>;
}

export default function App() {
  return (
    <div className="App">
      <button onClick={() => window.history.pushState({}, null, "/base")}>
        Basic Path
      </button>
      <button
        onClick={() => window.history.pushState({}, null, "/pathParam/1")}
      >
        Route with path parameter
      </button>
      <button
        onClick={() =>
          window.history.pushState({}, null, "/queryParam?name=john")
        }
      >
        Route with query parameter
      </button>
      <button onClick={() => window.history.pushState({}, null, "/lost")}>
        Not found
      </button>
      <Route path="/base">
        <div>Hello from basic route</div>
      </Route>
      <Route path="/pathParam/{id}">
        <PathParamExemple />
      </Route>
      <Route path="/queryParam">
        <QueryParamExemple />
      </Route>
      <NotFound>
        <div>Not found !</div>
      </NotFound>
    </div>
  );
}
