# Git Workflow Guide

## Repository Initialized ✅

Your AgriVoice repository has been initialized and is ready for team development.

### Current Status

```
Branch: master (main production branch)
Commit: 205aee4 - initial: AgriVoice project structure and core setup
Files: 43 files, 3545 insertions
Status: Working tree clean
```

### Available Branches

| Branch | Purpose | Owner |
|--------|---------|-------|
| `master` | Production code | All |
| `dev` | Integration & testing | All |
| `feat/backend-api` | Backend development | Kalanza |
| `feat/frontend-ui` | Frontend development | Oram |
| `feat/copilot-integration` | Integration & DevOps | Lewis |

## Workflow

### For Backend Development (Kalanza)

```bash
# Switch to your branch
git checkout feat/backend-api

# Make changes
# ... edit files ...

# Commit with clear message
git add .
git commit -m "feat: implement image analysis endpoint"

# Push to remote (when remote is added)
git push origin feat/backend-api
```

### For Frontend Development (Oram)

```bash
# Switch to your branch
git checkout feat/frontend-ui

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "feat: add camera capture component"

# Push
git push origin feat/frontend-ui
```

### For Integration (Lewis)

```bash
# Switch to your branch
git checkout feat/copilot-integration

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "feat: configure copilot studio actions"

# Push
git push origin feat/copilot-integration
```

## Commit Message Format

Use clear, concise commit messages:

```
<type>: <short description>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `style:` - Formatting

**Examples:**
- `feat: implement Azure Vision integration`
- `fix: resolve CORS error in API`
- `docs: update setup instructions`
- `refactor: optimize diagnosis algorithm`

## Pushing to Remote

Once you have a remote repository (GitHub, Azure Repos, etc.), add it:

```bash
git remote add origin https://github.com/your-username/agrivoice.git
git push -u origin master
git push -u origin dev
git push -u origin feat/backend-api
git push -u origin feat/frontend-ui
git push -u origin feat/copilot-integration
```

## Pull Request Workflow

1. Push your feature branch
2. Create a Pull Request (PR)
3. Request reviews from team members
4. Once approved, merge to `dev`
5. Test on `dev`
6. Merge `dev` to `master` for production

## Useful Commands

```bash
# Check current branch
git branch

# Switch branch
git checkout branch-name

# See recent commits
git log --oneline -10

# See changes
git diff

# See status
git status

# Undo last commit (not pushed)
git reset --soft HEAD~1

# Pull latest changes
git pull origin branch-name
```

---

**Repository**: AgriVoice  
**Initialized**: November 24, 2025  
**Status**: Ready for Development ✅
