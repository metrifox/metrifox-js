import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
  // ES Module build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "es",
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist",
      }),
    ],
  },
  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
      exports: "named",
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
  },
  // UMD build for browsers
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "Metrifox",
      exports: "named",
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
  },
];
