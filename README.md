# Automated Broadband Installation Workflow

[![CI Pipeline](https://github.com/pushkarwaykole/automated-broadband-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/pushkarwaykole/automated-broadband-workflow/actions)
[![Java Version](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://www.docker.com/)

An enterprise-grade, cloud-native telecommunications application that automates the broadband installation request lifecycle from initial customer submission, geolocation and KYC document validation, reviewer feasibility inspection, approval/rejection decision recording, through technician installation scheduling.

---

## 🎓 Student & Academic Details

- **Student Name**: Pushkar Waykole
- **Roll Number**: 23102C0012
- **Class / Division**: BE VII, Division C
- **Academic Year**: 2026–2027
- **Course**: DevOps Project

---

## 🌟 Core Features

### 1. User Authentication & Role-Based Access Control (RBAC)
- Stateless authentication using **JSON Web Tokens (JWT)** and **BCrypt** password hashing.
- Role segregation: **Customer** (`ROLE_CUSTOMER`) and **Reviewer** (`ROLE_REVIEWER`).
- Quick demo autofill buttons for rapid testing without manual registration.

### 2. Customer Installation Portal
- Plan selection with speed tiers (100 Mbps, 300 Mbps, 500 Mbps, 1 Gbps) and monthly pricing.
- Complete request submission form with client- and server-side validation (10-digit phone number, valid email, postal code, preferred installation date).
- Supporting KYC / Address Proof document upload with file type (`.pdf`, `.png`, `.jpg`) and size limit (<10MB) enforcement.
- Live request history table with status badges and search/filtering.
- Interactive **Lifecycle Progress Timeline** (`Submitted` &rarr; `Under Review` &rarr; `Approved` / `Rejected` &rarr; `Installation Scheduled`) displaying reviewer remarks, rejection reasons, scheduled dates, and assigned technicians.

### 3. Reviewer Operations Console
- Operational KPI summary metrics (Total Requests, Pending Reviews, Approved, Scheduled, Rejected).
- Quick status filter pills and full-text search across IDs, customer names, and cities.
- Supporting document inspector with download links.
- Reviewer decision engine:
  - Move request to **Under Review** for feasibility checks.
  - **Approve Request** with scheduled installation date and assigned field technician.
  - **Reject Request** with mandatory rejection justification.
- **Immutable Audit Trail** log recording timestamps, officer username, action, and status transitions.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Custom Telecommunications CSS Theme |
| **Backend** | Java 21, Spring Boot 3.2.5, Spring Security, Spring Data JPA |
| **Databases** | MySQL 8.0 (Production / Docker), H2 In-Memory (Local Dev & Unit Testing) |
| **Testing** | JUnit 5, MockMvc, Selenium WebDriver 4 (Headless Chrome), Page Object Model |
| **Containerization** | Docker, Docker Compose, Multi-stage builds |
| **CI/CD** | Jenkins (Declarative Pipeline with `Jenkinsfile`), GitHub Actions |
| **Config Management** | Ansible (Idempotent Playbooks & Roles) |
| **Reverse Proxy** | Nginx Alpine |
| **Version Control** | Git & GitHub (Feature branches, PR templates, Issue templates) |

---

## 📁 Repository Structure

```text
automated-broadband-workflow/
├── backend/                      # Spring Boot 3 Java 21 Backend
│   ├── src/main/java/com/telecom/broadband/
│   │   ├── config/               # SecurityConfig, JwtProvider, DataInitializer
│   │   ├── controller/           # Auth, Request, Document, Health REST APIs
│   │   ├── dto/                  # Request/Response Data Transfer Objects
│   │   ├── entity/               # User, InstallationRequest, Document, AuditLog
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   └── service/              # Workflow Engine, AuthService, DocumentStorage
│   ├── pom.xml                   # Maven build configuration
│   └── mvnw, mvnw.cmd            # Maven Wrapper scripts
├── frontend/                     # React 18 SPA (Vite)
│   ├── src/
│   │   ├── components/           # Navbar, LandingPage, Customer/Reviewer Dashboards
│   │   ├── services/api.js       # JWT & Fetch API Client
│   │   ├── App.jsx, index.css    # Root application and telecom design system
│   └── package.json, vite.config.js
├── tests/selenium/               # Automated E2E Test Suite
│   ├── src/test/java/.../selenium/
│   │   ├── pages/                # Page Object Models (Login, Customer, Reviewer)
│   │   ├── TestBase.java         # Headless browser driver & failure screenshot watcher
│   │   └── BroadbandWorkflowE2ETest.java # 5 Required E2E user journeys
│   └── pom.xml
├── ansible/                      # Ansible Provisioning & Automation
│   ├── inventory.ini             # Target inventory hosts
│   ├── playbook.yml              # Idempotent infrastructure & app deployment playbook
│   ├── rollback.yml              # Automated rollback playbook
│   └── roles/ (docker, app)      # Modular Ansible roles
├── deploy/
│   ├── nginx/nginx.conf          # Nginx reverse proxy routing
│   └── scripts/                  # One-click start-local.ps1 and start-local.sh
├── docs/                         # SRS, Architecture, ERD, and DevOps documentation
├── .github/                      # GitHub Actions CI workflow, PR & Issue templates
├── Dockerfile.backend            # Multi-stage Spring Boot Dockerfile
├── Dockerfile.frontend           # Multi-stage React + Nginx Dockerfile
├── docker-compose.yml            # Multi-container orchestration (MySQL, Backend, Frontend)
├── Jenkinsfile                   # Declarative 10-stage CI/CD pipeline
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java Development Kit (JDK 21)**
- **Node.js 18+ and npm**
- **Docker & Docker Compose** (for containerized deployment)
- **Google Chrome** (for Selenium browser tests)

---

### Option A: Run Locally for Development

#### Windows (PowerShell)
```powershell
# 1. Start Backend (Terminal 1)
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\mvnw.cmd spring-boot:run

# 2. Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

*Or execute the single-command helper script:*
```powershell
.\deploy\scripts\start-local.ps1
```

#### Linux / macOS (Bash)
```bash
chmod +x deploy/scripts/start-local.sh
./deploy/scripts/start-local.sh
```

**Access URLs:**
- **Frontend Web Portal**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)
- **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:broadband_db`, User: `sa`, Password: *empty*)

---

### Option B: Run with Docker Compose (Production Stack)

```bash
# 1. Create environment file from template
cp .env.example .env

# 2. Build and launch all containers (MySQL, Backend, Nginx/Frontend)
docker compose up --build -d

# 3. Check container status & health
docker compose ps

# 4. View real-time logs
docker compose logs -f
```

**Access Production Containerized URLs:**
- **Web Application**: [http://localhost](http://localhost) (Port 80)
- **Backend Health Check**: [http://localhost/actuator/health](http://localhost/actuator/health)

To stop and remove containers:
```bash
docker compose down
```

---

## 🧪 Automated Testing

### 1. Spring Boot Backend Unit & Integration Tests
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\mvnw.cmd test
```
*Coverage*: Health check, User login, Customer request submission, Reviewer approval, Validation rejection.

### 2. Selenium Automated E2E WebDriver Tests
```powershell
cd tests\selenium
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\mvnw.cmd test -Dheadless=true
```
*Executed Journeys*:
1. **User Login & Logout**: Customer and Reviewer role rendering.
2. **Valid Broadband Submission**: Order creation and table verification.
3. **Invalid Request Validation**: Form validation on phone numbers and required fields.
4. **Reviewer Decision**: Remarks entry and approval status update.
5. **Customer Status Tracking**: Progress timeline and audit history inspection.

Failure screenshots are saved automatically to `tests/selenium/target/test-screenshots/`.

---

## 🔄 Jenkins CI/CD Pipeline

The declarative `Jenkinsfile` executes the following multi-stage pipeline:

1. **Checkout SCM**: Checks out the active Git branch via SCM polling or GitHub webhook.
2. **Backend Build & Test**: Compiles Spring Boot and executes JUnit tests.
3. **Frontend Build**: Runs `npm ci` and compiles production assets with Vite.
4. **Package Artifacts**: Packages the Spring Boot executable JAR and archives it in Jenkins.
5. **Selenium E2E Verification**: Executes headless Selenium tests in Chrome.
6. **Docker Image Build**: Builds versioned images tagged with `${BUILD_NUMBER}`.
7. **Docker Push to Registry**: Authenticates using Jenkins Credentials and pushes to Docker Hub.
8. **Deploy to Target Environment**: Executes `docker compose up -d` in the specified environment (`staging` / `production`).
9. **Post-Deploy Health Check**: Actively polls `http://localhost:8080/api/health` with retry intervals.
10. **Automated Rollback**: Triggers container restart/rollback if health checks fail.

---

## ⚙️ Ansible Configuration Management

To provision a target server and deploy the application stack:

```bash
cd ansible

# 1. Run syntax check
ansible-playbook -i inventory.ini playbook.yml --syntax-check

# 2. Execute idempotent provisioning
ansible-playbook -i inventory.ini playbook.yml

# 3. Emergency rollback to previous version
ansible-playbook -i inventory.ini rollback.yml -e "rollback_tag=1.0.0"
```

---

## 🔑 Default Credentials for Demonstration

| Role | Username | Password | Full Name |
| :--- | :--- | :--- | :--- |
| **Customer** | `pushkar` | `Customer@123` | Pushkar Waykole |
| **Reviewer** | `reviewer` | `Reviewer@123` | Senior Review Officer |

---

## 📋 DevOps Project Milestone Deliverables Matrix (13 Tasks)

All 13 project milestone tasks specified in the evaluation matrix have been fully designed, implemented, tested, and documented with verifiable evidence:

| # | Milestone Task | Status | Implementation & Deliverable Artifacts |
| :-: | :--- | :---: | :--- |
| **1** | **Problem Definition & Scope** | ✅ **DONE** | [docs/PROBLEM_DEFINITION_AND_SCOPE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/PROBLEM_DEFINITION_AND_SCOPE.md)<br>• Problem statement, pain points, stakeholder matrix, measurable objectives, constraints & approved MVP scope. |
| **2** | **Agile Planning & DevOps Workflow** | ✅ **DONE** | [docs/AGILE_PLANNING_AND_KANBAN.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/AGILE_PLANNING_AND_KANBAN.md) & [docs/DEVOPS_WORKFLOW.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/DEVOPS_WORKFLOW.md)<br>• 10 User stories with Gherkin acceptance criteria, Product Backlog, 10-Task Kanban Board, Sprint Plan, Definition of Done, and DevOps lifecycle diagram. |
| **3** | **Requirements, Architecture & Tech Setup** | ✅ **DONE** | [docs/ARCHITECTURE_AND_API.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/ARCHITECTURE_AND_API.md) & [docs/SRS_AND_USE_CASES.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/SRS_AND_USE_CASES.md)<br>• 3-tier architecture diagram, database ERD, REST API specification, Maven build setup & MySQL/H2 schemas. |
| **4** | **Git & GitHub Repo Initialization** | ✅ **DONE** | [docs/GIT_WORKFLOW_EVIDENCE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/GIT_WORKFLOW_EVIDENCE.md)<br>• Repository URL, `.gitignore`, `.github/` PR & Issue templates, branch naming conventions, and initial skeleton commits. |
| **5** | **Feature Development with Branching** | ✅ **DONE** | [docs/GIT_WORKFLOW_EVIDENCE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/GIT_WORKFLOW_EVIDENCE.md)<br>• Feature branch `feature/request-submission`, Customer submission workflow, document upload, commit logs, PR & merge into `main`. |
| **6** | **MVP Completion & Git Collaboration** | ✅ **DONE** | [docs/GIT_WORKFLOW_EVIDENCE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/GIT_WORKFLOW_EVIDENCE.md) & [docs/CHANGELOG.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/CHANGELOG.md)<br>• Feature branch `feature/reviewer-dashboard`, intentional merge conflict in `CHANGELOG.md` resolved in commit `f9d9565`, and annotated release tag `v1.0.0`. |
| **7** | **Jenkins Installation & CI Job** | ✅ **DONE** | [Jenkinsfile](file:///c:/Users/pushk/Documents/Projects/Devops/Jenkinsfile) & [docs/JENKINS_CI_CD_EVIDENCE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/JENKINS_CI_CD_EVIDENCE.md)<br>• Configured Jenkins pipeline with SCM polling (`pollSCM('H/15 * * * *')`), Maven compile & test stage, and Spring Boot JAR artifact archiving. |
| **8** | **Pipeline as Code & Server Deployment** | ✅ **DONE** | [Jenkinsfile](file:///c:/Users/pushk/Documents/Projects/Devops/Jenkinsfile) & [docs/JENKINS_CI_CD_EVIDENCE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/JENKINS_CI_CD_EVIDENCE.md)<br>• Declarative Jenkinsfile with parameterized settings (`DEPLOY_ENV`, `IMAGE_TAG`), deployment to Nginx & Docker Compose, and console run evidence. |
| **9** | **Selenium Test Design & Local Execution** | ✅ **DONE** | [tests/selenium/](file:///c:/Users/pushk/Documents/Projects/Devops/tests/selenium/) & [docs/SELENIUM_TESTING_EVIDENCE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/SELENIUM_TESTING_EVIDENCE.md)<br>• 5 Critical user journeys, Page Object Model, Maven headless Chrome runner, and automatic failure screenshot watcher (`TestWatcher`). |
| **10** | **Continuous Testing in Jenkins** | ✅ **DONE** | [docs/JENKINS_CI_CD_EVIDENCE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/JENKINS_CI_CD_EVIDENCE.md)<br>• Selenium stage integrated into Jenkinsfile with JUnit report publishing, deployment blocked upon deliberate defect, defect fixed, and rerun passed. |
| **11** | **Docker Image & Container Lifecycle** | ✅ **DONE** | [Dockerfile.backend](file:///c:/Users/pushk/Documents/Projects/Devops/Dockerfile.backend), [Dockerfile.frontend](file:///c:/Users/pushk/Documents/Projects/Devops/Dockerfile.frontend), [docker-compose.yml](file:///c:/Users/pushk/Documents/Projects/Devops/docker-compose.yml) & [docs/DOCKER_LIFECYCLE_EVIDENCE.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/DOCKER_LIFECYCLE_EVIDENCE.md)<br>• Multi-stage build definitions, port mapping, container logs, stop/restart/remove command logs and running container verification. |
| **12** | **Configuration Management Scripts** | ✅ **DONE** | [ansible/](file:///c:/Users/pushk/Documents/Projects/Devops/ansible/) & [docs/ANSIBLE_PROVISIONING_AND_ROLLBACK.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/ANSIBLE_PROVISIONING_AND_ROLLBACK.md)<br>• Server prerequisites specification (packages, users, ports, directories), Ansible inventory, modular roles (`docker`, `app`), and master `playbook.yml`. |
| **13** | **Automated Rollback & Reliability Validation**| ✅ **DONE** | [ansible/rollback.yml](file:///c:/Users/pushk/Documents/Projects/Devops/ansible/rollback.yml) & [docs/ANSIBLE_PROVISIONING_AND_ROLLBACK.md](file:///c:/Users/pushk/Documents/Projects/Devops/docs/ANSIBLE_PROVISIONING_AND_ROLLBACK.md)<br>• Clean target provisioning, idempotency verification (`changed=0`), automated health check probing (`/api/health`), and automated rollback execution log. |

---

## 📄 License & Attribution

Developed by **Pushkar Waykole** (Roll No: **23102C0012**) for the BE VII DevOps Project, Academic Year 2026–2027.

