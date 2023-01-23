import typescript from "@rollup/plugin-typescript";
import jsx from "rollup-plugin-jsx";
import inject from "@rollup/plugin-inject";
import path from "path";

export default {
  input: ["./src/index.tsx"],
  output: {
    format: "es",
    dir: "dist",
    globals: { ["./src/jsx.ts"]: "jsxPragma" },
  },
  plugins: [
    [jsx({ factory: "jsxPragma", passUnknownTagsToFactory: true })],
    [
      typescript({
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        outDir: "./dist",
        noEmit: true,
        jsx: "preserve",
        reactNamespace: "JSX",
      }),
      inject({
        jsxPragma: path.resolve(__dirname, "src/jsx.ts"),
      }),
    ],
  ],
  sourceMap: true,
};
