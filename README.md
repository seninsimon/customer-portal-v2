# Project Guidelines & Standards

This repository follows strict coding, organizational, and contribution standards. Please read and follow these guidelines before working on the project.



## Package Manager

* **Always use `pnpm`** as the package manager.
* **Do NOT use** `npm`, `yarn`, or any other package managers.



## Project Setup

* This is a **Next.js** project using **TypeScript**.
* **Never use `any` as a type**. Always define a **specific** or **generic type**.
* Use **Node.js 20 LTS or above**.
* Always opt-in to use the **`src/` folder** when creating a Next.js project.
* Enable **Strict Mode** in `tsconfig.json` and `next.config.js`.



## Environment Variables

* Do **NOT** use trailing slashes (`/`) in `.env` files.
* Use **snake\_case** for all environment variable names (e.g., `API_BASE_URL`).
* **Do not use camelCase** for environment variables.
* Never commit `.env` files to the repository; use `.env.example` for structure.



## File & Folder Structure

* **File Naming Convention**:

  ```
  <name>.<function-or-use>.<extension>
  ```

  Examples:

  * `base.service.ts`
  * `hero.section.tsx`
  * `about-us.section.tsx`
* Use `.ts` or `.tsx` for TypeScript files.
* Use `.js` only in exceptional cases.
* **Do NOT create an `assets/` folder**.
  All static assets should be organized inside the `public/` folder.
* Keep components modular and reusable inside the `src/components` directory.
* Organize hooks under `src/hooks`, utilities under `src/utils`, and services under `src/services`.



## Code Quality & Best Practices

* Always **refactor code** for readability and **reusability**.
* Maintain **DRY (Don’t Repeat Yourself)** and **KIS (Keep It Simple)** principles.
* Avoid **hardcoding** values; use constants or environment variables.
* Ensure **type safety** across the project.
* Use **ESLint** and **Prettier** for consistent code formatting and linting.
* Run `pnpm lint` before committing changes.
* Avoid unnecessary console logs in production code.
* Follow **accessibility (a11y)** standards in UI components.
* Optimize images and static assets for performance.



## Git & Branching Workflow

* **Always create a new branch** for each task/feature/bug fix from **`dev` branch**.

* Branch naming convention:

  ```
  feature/<short-description>
  fix/<short-description>
  hotfix/<short-description>
  ```

  Example:
  `feature/add-user-auth`, `fix/navbar-alignment`

* Once the task is completed:

  * Create a **Pull Request (PR)**.
  * After merging the PR, **delete the branch**.



## Commit & PR Guidelines

* Each **commit must include a meaningful and self-explanatory message**.

  * Example: `feat: added login form with validation`
* Keep **commits atomic and small** (one logical change per commit).
* Do not mix unrelated changes in a single commit.
* **PR message must clearly explain the aim and the impact** of the changes.
* Keep PRs **small and focused**.
* Avoid committing after creating a PR unless absolutely necessary.



## Security

* Validate and sanitize user inputs.
* Never commit secrets or credentials to the repository.
* Use **HTTPS** for API calls in production.



## Checklist Before PR

- Code formatted with Prettier
- Linting issues fixed (`pnpm lint`)
- No usage of `any` type
- No console logs or unused code
- Branch merged from latest `dev`

---

### Summary Quick Rules

- Use `pnpm`
- TypeScript only (no `any`)
- Node.js 20 LTS or above
- Use `src/` folder for Next.js projects
- Snake\_case for env variables (no trailing slashes)
- Proper file naming convention
- Reusable and maintainable code
- New branch per task → PR → Delete branch
- Atomic commits with clear messages
- PR with clear explanation
- Public folder for static assets
- Lint & format before commit
