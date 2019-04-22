import React from "react";

export default function Header() {
  return (
    <>
      <button onClick={() => window.history.pushState({}, null, "/foo")}>
        Basic Path
      </button>
      <button onClick={() => window.history.pushState({}, null, "/bar/1")}>
        Route with path parameter
      </button>
      <button
        onClick={() => window.history.pushState({}, null, "/lol?name=john")}
      >
        Route with query parameter
      </button>
    </>
  );
}
