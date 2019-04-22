// rollup.config.js
const config = {
  input: "src/index.js",
  external: ["react"],
  output: {
    format: "es",
    name: "naive-router",
    external: ["react"],
    globals: {
      react: "React"
    }
  }
};
export default config;
