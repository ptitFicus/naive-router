import match from "./matcher";

test("/foo/bar should match /foo/bar", () => {
  const path = "/foo/bar";
  expect(match(path, path)).toEqual({});
});

test("/foo/bar should match /foo/bar/", () => {
  const path = "/foo/bar";
  expect(match(`${path}/`, path)).toEqual({});
});

test("/foo/bar/ should match /foo/bar", () => {
  const path = "/foo/bar";
  expect(match(path, `${path}/`)).toEqual({});
});

test("foo/bar should match /foo/bar/", () => {
  const path = "foo/bar";
  expect(match(path, `/${path}/`)).toEqual({});
});

test("/foo/bar/ should match foo/bar", () => {
  const path = "foo/bar";
  expect(match(`/${path}/`, path)).toEqual({});
});

test("/foo/bar/ should match foo/bar", () => {
  const path = "foo/bar";
  expect(match(`/${path}/`, path)).toEqual({});
});

test("/foo/bar should match /foo/{id} with {id: 'bar'}", () => {
  const matchResult = match("/foo/{id}", "/foo/bar");
  expect(matchResult).toBeTruthy();
  expect(matchResult).toEqual({ id: "bar" });
});

test("/foo/bar/lol should match /foo/{id}/{name} with {id: 'bar', name: 'lol'}", () => {
  const matchResult = match("/foo/{id}/{name}", "/foo/bar/lol");
  expect(matchResult).toBeTruthy();
  expect(matchResult).toEqual({ id: "bar", name: "lol" });
});

test("/foo/bar/lol should match /foo/{id}/lol with {id: 'bar'}", () => {
  const matchResult = match("/foo/{id}/lol", "/foo/bar/lol");
  expect(matchResult).toBeTruthy();
  expect(matchResult).toEqual({ id: "bar" });
});

test("/foo/bar should not match /foo", () => {
  expect(match("/foo", "/foo/bar")).toBe(false);
});

test("/foo should not match /foo/bar", () => {
  expect(match("/foo/bar", "/foo")).toBe(false);
});
