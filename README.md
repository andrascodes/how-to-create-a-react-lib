# How to create a React library

Walkthrough for setting up a React Library repo with Github, React, Typescript, Rollup and Emotion.

## Sources:

- [Creating a React Component Library using Rollup, Typescript, Sass and Storybook](https://blog.harveydelaney.com/creating-your-own-react-component-library/)
- [3 Ways to Build Your Own React Component Library](https://blog.bitsrc.io/3-ways-to-build-your-own-react-component-library-b4d00013a716)
- [create-react-library - Github](https://github.com/transitive-bullshit/create-react-library)

## Development:

```
yarn install
yarn watch
```

- To run the build process of the component library in watch mode

```
cd example
yarn install
yarn start
```

- To run the example React app in development mode
- This way the component library will re-build and the example React app will re-compile every time a file changes.

## Walkthrough:

### 1. [Create a new repository on Github](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/4ca4b4f987ff2c7c7981ceff4d5c412b84b61efc)

- Initialize repo with a README
- Add .gitignore with Node.js presets
- Add an MIT License

### 2. [Initialize package](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/84313ef838b4dda06dc4302a9dff461a79012e1f)

- Run `yarn init`

### 3. [Install `react` and `react-dom` as `peerDependencies`](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/fb028b90e80379cacb8b56dff41cc3c079503693)

- `yarn add -D react react-dom @types/react`
- Set them as `peerDependencies` in `package.json` (use the version you want to support):

```json
...
"peerDependencies": {
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0"
}
...
```

### 4. [Install and configure `typescript`](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/4933f8f54e6591fb68025e570d287a9e7934d6ab)

- `yarn add -D typescript`
- Add the following `tsconfig.json` file in root:

```json
{
  "compilerOptions": {
    "outDir": "dist",
    "module": "esnext",
    "lib": ["es6", "dom", "esnext"],
    "target": "es5",
    "moduleResolution": "node",
    "jsx": "react",
    "sourceMap": true,
    "declaration": true,
    "declarationDir": "dist",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "example/build",
    "src/**/*.stories.tsx",
    "src/**/*.test.tsx"
  ]
}
```

### 5. [Create example component and install `emotion`](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/5c03c16c7525a44d9308d42943e180f83ef4fd91)

- `yarn add -D @emotion/core @emotion/styled`
- Add the following folder structure:

```
src/
  TestComponent/
    index.ts
    TestComponent.tsx
  index.ts
```

- `TestComponent.tsx`:

```jsx
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export interface TestComponentProps {
  color: 'darkgreen' | 'lightgreen';
}

const TestComponent: React.FC<TestComponentProps> = ({ color }) => (
  <div
    css={css`
      background-color: hotpink;
      &:hover {
        color: ${color};
      }
    `}
  >
    This is a {color} component with a hotpink background.
  </div>
);

export default TestComponent;
```

- In `src/index.ts`, make sure to use named exports ([Source](https://github.com/rollup/rollup/issues/1961#issuecomment-423037881)):

```jsx
export { default as TestComponent } from './TestComponent';
```

### 6. [Install `rollup` and plugins](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/7784ff6ea65c610526ff64d1d3127bdc1f44a054)

- `yarn add -D rollup rollup-plugin-typescript2 @rollup/plugin-commonjs @rollup/plugin-node-resolve rollup-plugin-peer-deps-external`
- Add the following `rollup.config.js` file in root:

```js
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true })
  ]
};
```

- Add the following config variables and scripts in `package.json`:

```json
...
"main": "dist/index.js",
"module": "dist/index.es.js",
"files": ["dist"],
"types": "dist/index.d.ts",
"scripts": {
  "build": "rollup -c",
  "watch": "rollup -cw"
},
...
```

- Run `yarn build`

### 8. [Generate example React app with `create-react-app`](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/a6b84bf081305cba32a79d84a2857bbdaa0d6a91)

- `npx create-react-app example --template typescript`

### 9. [Install the example app's dependencies in the parent package](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/48f40e0faf3488fa8bc4013aa4a182f3394182e3)

- `yarn add -D @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest @types/node @types/react-dom react-scripts`

### 10. [Link the example app's dependencies to the ones installed to the parent](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/0048913b10f5ca31d18c9293f8265a22d9972a94)

```json
...
  "dependencies": {
    ...
    "react": "link:../node_modules/react",
    "react-dom": "link:../node_modules/react-dom",
    "react-scripts": "link:../node_modules/react-scripts",
    ...
  },
  ...
  "scripts": {
    "start": "node ../node_modules/react-scripts/bin/react-scripts.js start",
    ...
  },
  ...
```

- Add a link to the development package in `package.json`:

```json
  ...
  "dependencies": {
    ...
    "how-to-create-a-react-lib": "link:.."
  },
  ...
```

### 11. [Use the development package in the example app](https://github.com/andrewszucs/how-to-create-a-react-lib/commit/c5146c7b5595bf02fabea3d65ecd950e9f925fa1)

- Run `yarn install` in the example app
- Import the development package in the `App.tsx`:

```jsx
import { TestComponent } from 'how-to-create-a-react-lib';
```

### 12. Develop the library and run the example app

```
yarn watch
cd example && yarn start
```

- Change the code in the `src/` folder

## Deploying the example app to Github Pages ([Source](https://create-react-app.dev/docs/deployment/))

- Add a `homepage` variable to both `./package.json` and `./example/package.json` (Optional)
  - Per CRA docs: we need to set the `homepage` variable if we use routing in our app
  - Use the base path where you will be serving the React app from. ([More info](https://docs.github.com/en/github/working-with-github-pages/about-github-pages))

```json
...
"homepage": "http://andrewszucs.github.io/how-to-create-a-react-lib",
...
```

- `yarn add -D gh-pages`

- Add the following `scripts` to `package.json` in root:
  - I needed the `clean` script because I ran into [this](https://github.com/transitive-bullshit/react-modern-library-boilerplate/issues/15) issue saying: `fatal: A branch named 'gh-pages' already exists.`

```json
...
"scripts": {
  ...
  "clean" : "gh-pages-clean",
  "predeploy": "cd example && yarn install && yarn build",
  "deploy": "gh-pages -d example/build"
  ...
}
...
```

- Run `yarn deploy`
  - This will create a new branch named `gh-pages` commit the `example/build` folder to that branch, push it to our Github repo and set it as the base for Github Pages.

## Setting up ESLint, Prettier, Husky and Lint-staged for code quality

### 1. [Add ESLint with the `eslint-config-react-app` preset](https://www.npmjs.com/package/eslint-config-react-app)

- `yarn add -D eslint-config-react-app @typescript-eslint/eslint-plugin@2.x @typescript-eslint/parser@2.x babel-eslint@10.x eslint@6.x eslint-plugin-flowtype@4.x eslint-plugin-import@2.x eslint-plugin-jsx-a11y@6.x eslint-plugin-react@7.x eslint-plugin-react-hooks@2.x`
- Create an `.eslintrc.json` file and add the following:

```json
{
  "extends": ["react-app"],
  /** These are optional: */
  "rules": {
    /** Warn if console.log are added */
    "no-console": "warn",

    /** Enforcing rules about import ordering */
    "import/order": [
      "warn",
      {
        "groups": [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
        "newlines-between": "always-and-inside-groups"
      }
    ]
  }
}
```

### 2. [Add Prettier and integrate it with ESLint](https://thomlom.dev/setup-eslint-prettier-react/)

- `yarn add -D prettier eslint-config-prettier eslint-plugin-prettier`
- Add `plugin:prettier/recommended` to the `extends` array in `eslintrc.json`:

```json
{
  "extends": [..., "plugin:prettier/recommended"],
  ...
}
```

- Add a `.prettierrc` file to configure Prettier:

```json
{
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "trailingComma": "none",
  "tabWidth": 2,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "printWidth": 90
}
```

### 3. [Add `husky` and `lint-staged` to lint and format at each commit](https://thomlom.dev/setup-eslint-prettier-react/)

- `yarn add -D husky lint-staged`

- Add a `lint` and a `format` script to `package.json`:

```json
"scripts": {
  "lint": "eslint . --max-warnings=0",
  "format": "prettier --write \"**/*.+(js|jsx|ts|tsx|json|yml|yaml|css|md|vue)\"",
}
```

- Add the `husky` and `lint-staged` config to `package.json`:

```json
"husky": {
    "hooks": {
      "pre-commit": "yarn lint && yarn format"
    }
  },
"lint-staged": {
  "*.+(js|jsx|ts|tsx)": [
    "eslint --fix",
    "git add"
  ],
  "*.+(json|css|md)": [
    "prettier --write",
    "git add"
  ]
},
```

### 4. Add a script for running Typescript check

- Add the following to `scripts` in `package.json`:

```json
...
"scripts": {
  ...
  "typecheck": "tsc -p ./tsconfig.json",
  "typecheck:watch": "yarn typecheck --watch"
}
...
```

## [Adding Minification to the build process](https://medium.com/better-programming/lets-build-react-components-library-part-3-b2e7aec478a2)

- `yarn add -D rollup-plugin-uglify rollup-plugin-terser`
- Change `rollup.config.js`

## Setting up semantic-release and Github Actions workflow

- `npx semantic-release-cli setup`
- Add this to `package.json`:

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/",
    "pkgRoot": "build"
  }
}
```

- Change back `version` in `package.json`:

```json
"version":"1.0.0"
```

- Add `.releaserc.json` to configure `semantic-release`:

```json
{
  "branches": "master",
  "repositoryUrl": "https://github.com/andrewszucs/how-to-create-a-react-lib",
  "debug": "true",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "package-lock.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
```

- `yarn add -D @semantic-release/git @semantic-release/changelog`

### Setting up `commitizen`

- `yarn add -D commitizen`
- `npx commitizen init cz-conventional-changelog --yarn --dev --exact`
