# Pinx

## GitHub Repository Setup Guide

Follow these steps to upload this starter template to your GitHub account:

1. **Create a new GitHub repository**
   - Go to [GitHub](https://github.com/) and sign in to your account
   - Click on the "+" icon in the top-right corner and select "New repository"
   - Enter a name for your repository (e.g., "nuxtpinx")
   - Optionally add a description
   - Choose whether to make the repository public or private
   - Do NOT initialize the repository with a README, .gitignore, or license
   - Click "Create repository"

2. **Connect your local repository to GitHub**
   - After creating the repository, GitHub will show setup instructions
   - Copy the URL of your repository (it will look like `https://github.com/yourusername/nuxtpinx.git`)
   - In your terminal or command prompt, run:
     ```bash
     git remote add origin https://github.com/yourusername/nuxtpinx.git
     ```
     (Replace the URL with your actual repository URL)

3. **Add all files to Git**
   ```bash
   git add .
   ```

4. **Commit the changes**
   ```bash
   git commit -m "Initial commit"
   ```

5. **Push the code to GitHub**
   ```bash
   git push -u origin main
   ```
   Note: If your default branch is named "master" instead of "main", use:
   ```bash
   git push -u origin master
   ```

6. **Verify the repository**
   - Go to your GitHub repository URL to confirm all files have been uploaded

## Maintaining Your GitHub Repository

After your initial setup, here are some common Git commands for maintaining your repository:

- **Pull latest changes** (when collaborating with others):
  ```bash
  git pull origin main
  ```

- **Check status of your files**:
  ```bash
  git status
  ```

- **Stage changes for commit**:
  ```bash
  git add .
  ```
  Or to add specific files:
  ```bash
  git add filename.vue
  ```

- **Commit your changes**:
  ```bash
  git commit -m "Your descriptive commit message"
  ```

- **Push changes to GitHub**:
  ```bash
  git push
  ```

- **Create and switch to a new branch** (for new features):
  ```bash
  git checkout -b feature-name
  ```

- **Switch between branches**:
  ```bash
  git checkout branch-name
  ```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

See [Nuxt Configuration Reference](https://nuxt.com/docs/api/configuration/nuxt-config/).

## Project Setup

### Install dependencies

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Generate (SSG) the application for production:

```bash
npm run generate
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
