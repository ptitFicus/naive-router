import React, { useState } from "react";
import { Route } from "naive-router";
import Header from "./Header";

function Foo({ id }) {
  return <div>Path parameter: id={id}</div>;
}

function Lol({ name }) {
  return <div>Query parameter: name={name}</div>;
}

export default function App() {
  const [lastRoute, setLastRoute] = useState(true);
  const [allRoutes, setAllRoutes] = useState(true);
  return (
    <div className="App">
      <Header />
      {allRoutes && (
        <>
          <Route path="/foo">
            <div>Hello from basic route</div>
          </Route>
          <Route path="/bar/{id}">
            <Foo />
          </Route>
          {lastRoute && (
            <Route path="/lol">
              <Lol />
            </Route>
          )}
        </>
      )}
      <br />
      <button onClick={() => setLastRoute(!lastRoute)}>
        Toggle last route
      </button>
      <br />
      <button onClick={() => setAllRoutes(!allRoutes)}>
        Toggle all routes
      </button>
    </div>
  );
}
