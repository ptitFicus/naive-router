import { terser } from "rollup-plugin-terser";

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
  },
  plugins: [terser()]
};
export default config;
