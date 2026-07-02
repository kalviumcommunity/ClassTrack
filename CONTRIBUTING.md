# Contributing to ClassTrack

Thank you for your interest in contributing to **ClassTrack**! We welcome all contributions — bug fixes, new features, documentation improvements, and more.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## 🤝 Code of Conduct

This project follows a contributor code of conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and constructive in all interactions.

---

## 🛠️ How to Contribute

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/ClassTrack.git
   cd ClassTrack
   ```
3. **Set up** the upstream remote:
   ```bash
   git remote add upstream https://github.com/kalviumcommunity/ClassTrack.git
   ```
4. **Create** a feature branch (see naming convention below)
5. **Make** your changes
6. **Test** your changes locally
7. **Submit** a Pull Request

---

## 💻 Development Setup

See the [README.md](README.md) for complete setup instructions. Quick start:

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install --legacy-peer-deps

# Seed the database
cd backend && npm run seed

# Start dev servers (from root)
npm run dev
```

---

## 🌿 Branch Naming Convention

Use the following prefixes:

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/<short-description>` | `feature/ai-smart-search` |
| Bug Fix | `fix/<issue-number>-<description>` | `fix/42-login-redirect` |
| Documentation | `docs/<description>` | `docs/update-api-table` |
| Refactor | `refactor/<description>` | `refactor/auth-middleware` |
| Hotfix | `hotfix/<description>` | `hotfix/crash-on-null-user` |

---

## 📝 Commit Message Convention

We follow **Conventional Commits**:

```
<type>(optional scope): <short summary>

[optional body]

[optional footer]
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `style` — formatting, no logic changes
- `refactor` — code restructuring, no feature/fix
- `test` — adding or updating tests
- `chore` — build process or tooling changes

**Examples:**
```
feat(ai): add OpenAI embedding-based student search
fix(auth): redirect to correct dashboard after login
docs: update load-testing instructions in README
```

---

## 🔀 Pull Request Process

1. Ensure your branch is up to date with `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. Make sure there are no merge conflicts.
3. Add a clear **PR title** following the commit convention.
4. Fill in the **PR description template** (auto-generated).
5. Link the PR to any related **Issues** using `Closes #<issue-number>`.
6. Request a review from a maintainer.
7. Address all review comments before merging.

---

## 🎨 Coding Standards

### Frontend (React)
- Use **functional components** with hooks — no class components.
- Use **named exports** for components; default exports for pages.
- Keep components under 200 lines — extract sub-components when needed.
- Use **Tailwind CSS** utility classes; avoid inline styles.
- Always handle loading and error states in UI components.

### Backend (Node.js/Express)
- Follow **REST** conventions for API endpoints.
- Use `async/await` with `try/catch` for all async handlers.
- Always validate request body fields before using them.
- Return consistent error shapes: `{ message: '...' }`.
- Never log sensitive data (passwords, tokens).

### General
- No `console.log` left in production code (use proper logging).
- Add JSDoc comments for exported functions.
- Write meaningful variable and function names.

---

## 🐛 Reporting Bugs

1. Search [existing issues](../../issues) to avoid duplicates.
2. Open a new issue using the [Bug Report template](../../issues/new?template=bug_report.md).
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (OS, Node version, browser)
   - Screenshots or error logs if applicable

---

## 💡 Requesting Features

1. Search [existing issues](../../issues) to check if it's already requested.
2. Open a new issue using the [Feature Request template](../../issues/new?template=feature_request.md).
3. Describe:
   - The problem you're solving
   - Your proposed solution
   - Any alternatives you considered

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
