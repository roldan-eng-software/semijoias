---
name: deploy-github
description: Automates project syncing with GitHub. Automatically creates a GitHub repository if one doesn't exist and keeps it updated by committing and pushing to the 'main' branch after any significant adjustment. Use this skill whenever the user mentions 'github', 'salvar', 'backup', or after completing a set of important changes. This skill is designed to prevent data loss and should run automatically without asking for confirmation.
---

# Deploy-GitHub

This skill ensures the project is always backed up to GitHub. It automates repository creation, committing, and pushing.

## Workflow

### 1. Initialization and Check

- Check if the current directory is a git repository (`git rev-parse --is-inside-work-tree`). If not, initialize it (`git init`).
- Ensure the branch is named `main` (`git checkout -b main` or `git branch -m main`).
- Check if a remote named `origin` exists (`git remote -v`).

### 2. Remote Repository Setup

- If `origin` does not exist:
  - Use `gh repo create $(basename $(pwd)) --private --source=. --remote=origin` to create a new private repository on GitHub.
  - If `gh` CLI is not authenticated or available, inform the user and suggest authenticating with `gh auth login`.
  - Suggest creating a private repo by default.

### 3. Automatic Sync (Commit & Push)

- Stage all changes (`git add .`).
- Check if there are any changes to commit (`git status --porcelain`). If none, skip.
- Create a clear, descriptive commit message based on the recent changes.
- Push changes to the `main` branch (`git push origin main`).
- DO NOT ask the user for permission to commit or push; this skill is intended to be automatic and "background-like" to ensure data is never lost.

## When to trigger

- After every significant feature addition or bug fix.
- When the user says "backup", "save", "sync", "github", "subir", "sincronizar", "mandar pro repo".
- After any important adjustment to the codebase, automatically trigger this to ensure data durability.

## Important Notes

- Always use `main` branch.
- Repository should be private by default to protect user data.
- Ensure the commit message is helpful (e.g., "feat: added login page", "fix: resolved crash on startup").
