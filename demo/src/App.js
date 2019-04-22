import React, { Component } from "react";
import { Route } from "naive-router";
import Header from "./Header";

function Foo({ id }) {
  return <div>Path parameter: id={id}</div>;
}

function Lol({ name }) {
  return <div>Query parameter: name={name}</div>;
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Route path="/foo">
          <div>Hello from basic route</div>
        </Route>
        <Route path="/bar/{id}">
          <Foo />
        </Route>
        <Route path="/lol">
          <Lol />
        </Route>
      </div>
    );
  }
}

export default App;
