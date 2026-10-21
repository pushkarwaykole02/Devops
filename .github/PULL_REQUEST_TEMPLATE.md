## Pull Request Summary
A concise overview of the changes introduced in this PR.

## Branch Naming Rule
- `feature/<name>` for new capabilities (e.g. `feature/request-submission`, `feature/reviewer-dashboard`)
- `bugfix/<name>` for bug fixes
- `devops/<name>` for CI/CD, Docker, or Ansible updates

## Proposed Changes
- [ ] Backend API / Entity update
- [ ] Frontend UI component
- [ ] DevOps (Jenkinsfile / Docker / Ansible)
- [ ] Selenium Test Automation

## Verification & Test Evidence
- [x] Backend tests executed (`./mvnw clean test`)
- [x] Frontend build tested (`npm run build`)
- [x] Selenium E2E suites passing
- [ ] Health check verified at `/api/health`

## Reviewer Checklist
- [ ] Code follows project architecture & clean code standards
- [ ] No hardcoded passwords or tokens
- [ ] Role-based authorization enforced on server endpoints
