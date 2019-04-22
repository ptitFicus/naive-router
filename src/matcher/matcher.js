/**
 * @param  {string} pathPattern pattern to match
 * @param  {string} path path to test against pathPattern
 * @returns {(boolean|object)} either false if path doesn't match pathPattern,
 * or an object containing valued path parameters of the route
 */
export default function match(pathPattern, path) {
  const patternParts = extractParts(pathPattern);
  const pathParts = extractParts(path);

  if (patternParts.length !== pathParts.length) {
    return false;
  }

  const absolutePartMatch = patternParts
    .map((patternPart, index) => {
      if (isVariable(patternPart)) {
        return true;
      }
      return patternPart === pathParts[index];
    })
    .reduce((acc, next) => acc && next, true);

  if (!absolutePartMatch) {
    return false;
  }

  return pathParts
    .map((part, index) => {
      if (isVariable(patternParts[index])) {
        return [[patternParts[index].replace(/{|}/g, "")], part];
      }

      return null;
    })
    .filter(res => res !== null)
    .reduce((curr, [key, value]) => {
      curr[key] = value;
      return curr;
    }, {});
}

function isVariable(pathPart) {
  return pathPart.startsWith("{");
}

function extractParts(path) {
  return path.split("/").filter(str => str.length > 0);
}
