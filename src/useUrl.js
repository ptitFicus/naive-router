import { useState } from "react";

export default function useUrl(onChange) {
  let { pathname: newPath } = new URL(window.location.href);

  const [currentPath, setUrl] = useState(undefined);

  if (newPath !== currentPath) {
    setUrl(newPath);
    onChange(newPath);
  }
}
