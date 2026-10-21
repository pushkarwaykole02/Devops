# Git Collaboration, Feature Branching & Merge Conflict Resolution Evidence

**Student**: Pushkar Waykole (Roll Number: 23102C0012)  
**Class**: BE VII, Division C (Academic Year: 2026–2027)  
**Project**: Automated Broadband Installation Workflow  
**Release Tag**: `v1.0.0`

---

## 1. Branching Strategy & Naming Conventions

The repository implements a GitFlow feature branching model:
- `main`: Production-ready release branch protected against direct unreviewed commits.
- `feature/request-submission`: Implements customer submission, validations, and document upload capabilities.
- `feature/reviewer-dashboard`: Implements reviewer console, decision engine, and audit logging.

---

## 2. Actual Git Commit Graph

```text
*   f9d9565 (HEAD -> main, tag: v1.0.0) Merge branch 'feature/reviewer-dashboard' into main (resolved merge conflict in CHANGELOG.md)
|\  
| * 2f60f6e (feature/reviewer-dashboard) feat(reviewer): implement reviewer decision engine and audit trail
* | 32043a6 (feature/request-submission) feat(customer): implement request submission validation and document upload
|/  
* 094bb94 feat(core): initial full-stack implementation of Automated Broadband Installation Workflow
```

---

## 3. Merge Conflict Demonstration & Resolution

### Triggering Event
Both `feature/request-submission` and `feature/reviewer-dashboard` branches concurrently introduced release entries to `docs/CHANGELOG.md`.

When merging `feature/reviewer-dashboard` into `main` after `feature/request-submission` was merged, Git generated a content conflict:

```text
Auto-merging docs/CHANGELOG.md
CONFLICT (add/add): Merge conflict in docs/CHANGELOG.md
Automatic merge failed; fix conflicts and then commit the result.
```

### Git Conflict Markers Encountered
```markdown
<<<<<<< HEAD
## [1.0.0] - Feature Branch: feature/request-submission
- Implemented Customer Request Submission Form
- Added client-side and server-side validation rules
- Added KYC and address proof upload capabilities
=======
## [1.0.0] - Feature Branch: feature/reviewer-dashboard
- Implemented Reviewer Console with status filters
- Added Feasibility review actions (Approve, Reject, Schedule)
- Added immutable audit trail logging
>>>>>>> feature/reviewer-dashboard
```

### Conflict Resolution Strategy
The conflict was manually reconciled by retaining both features under a structured, unified section for version `[1.0.0]` categorized into Customer and Reviewer features.

### Resolution Commit & Version Tag
- **Resolution Commit Hash**: `f9d9565`
- **Resolution Commit Message**: `Merge branch 'feature/reviewer-dashboard' into main (resolved merge conflict in CHANGELOG.md)`
- **Annotated Version Tag**: `v1.0.0` (`Release v1.0.0: Automated Broadband Installation Workflow (Pushkar Waykole)`)

---

## 4. GitHub Collaboration Templates

The repository includes standardized collaboration templates in `.github/`:
- **Bug Report Template**: [`.github/ISSUE_TEMPLATE/bug_report.md`](file:///C:/Users/pushk/.gemini/antigravity-ide/scratch/automated-broadband-workflow/.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Request Template**: [`.github/ISSUE_TEMPLATE/feature_request.md`](file:///C:/Users/pushk/.gemini/antigravity-ide/scratch/automated-broadband-workflow/.github/ISSUE_TEMPLATE/feature_request.md)
- **Pull Request Template**: [`.github/PULL_REQUEST_TEMPLATE.md`](file:///C:/Users/pushk/.gemini/antigravity-ide/scratch/automated-broadband-workflow/.github/PULL_REQUEST_TEMPLATE.md)
- **Automated GitHub Actions CI**: [`.github/workflows/ci.yml`](file:///C:/Users/pushk/.gemini/antigravity-ide/scratch/automated-broadband-workflow/.github/workflows/ci.yml)
