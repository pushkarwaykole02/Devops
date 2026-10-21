# DevOps Engineering Directory: Automated Broadband Installation Workflow

**Student**: Pushkar Waykole (Roll Number: 23102C0012)  
**Class**: BE VII, Division C (Academic Year: 2026–2027)

---

## 📁 Directory Structure & Purpose

This `devops/` directory consolidates all infrastructure, CI/CD, containerization, configuration management, and automation files for the **Automated Broadband Installation Workflow** project:

```text
devops/
├── jenkins/
│   └── Jenkinsfile            # 10-Stage Declarative CI/CD Pipeline
├── docker/
│   ├── Dockerfile.backend     # Multi-stage Java 21 Spring Boot Dockerfile
│   ├── Dockerfile.frontend    # Multi-stage React + Nginx Alpine Dockerfile
│   ├── docker-compose.yml     # Multi-container orchestration (MySQL, Backend, Frontend)
│   └── .env.example           # Environment variables template
├── ansible/
│   ├── inventory.ini          # Target inventory hosts (localhost / remote VM)
│   ├── playbook.yml           # Idempotent provisioning & deployment playbook
│   ├── rollback.yml           # Dedicated automated rollback playbook
│   └── roles/
│       ├── docker/            # Docker engine & user setup tasks
│       └── app/               # App directory, templating, and health check tasks
├── nginx/
│   └── nginx.conf             # Nginx reverse proxy configuration
├── scripts/
│   ├── deploy.sh              # One-command automated deployment script
│   ├── rollback.sh            # One-command automated rollback script
│   ├── start-local.ps1        # PowerShell local runner (Backend + Frontend)
│   ├── start-local.sh         # Bash local runner (Backend + Frontend)
│   └── run-selenium.ps1       # PowerShell runner for headless Selenium suite
├── ci/
│   └── ci.yml                 # GitHub Actions automated workflow
└── docs/
    ├── SRS_AND_USE_CASES.md   # Requirements & Mermaid use case diagrams
    ├── ARCHITECTURE_AND_API.md # Component architecture & REST API specifications
    ├── DEVOPS_WORKFLOW.md     # Pipeline design, Selenium POM, Docker & Ansible
    └── GIT_WORKFLOW_EVIDENCE.md # Git feature branching & merge conflict resolution proof
```

---

## 🚀 DevOps Execution Cheatsheet

### 1. Docker Compose
```bash
# Launch full containerized environment
docker compose up --build -d

# Check service health
docker compose ps

# View container logs
docker compose logs -f
```

### 2. Jenkins Pipeline
- Pipeline Script file path: `Jenkinsfile` or `devops/jenkins/Jenkinsfile`
- Configured with stages for Maven testing, React building, JAR packaging, Headless Selenium testing, Docker build/tag, Registry publishing, Deployment, and Health check verification.

### 3. Ansible Provisioning
```bash
cd devops/ansible
ansible-playbook -i inventory.ini playbook.yml
```

### 4. Automated Rollback
```bash
# Via Ansible:
ansible-playbook -i devops/ansible/inventory.ini devops/ansible/rollback.yml -e "rollback_tag=1.0.0"

# Via Shell Script:
./devops/scripts/rollback.sh 1.0.0
```
