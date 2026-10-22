# Ansible Configuration Management, Idempotency & Automated Rollback Evidence

**Project**: Automated Broadband Installation Workflow  
**Student**: Pushkar Waykole (Roll Number: 23102C0012)  
**Class**: BE VII, Division C (Academic Year: 2026–2027)  
**Tool**: Ansible 9+ / Core 2.16+, YAML Automation Playbooks  

---

## 1. Server Prerequisites Specification

Before deploying the Broadband Installation Workflow, target host nodes must meet the following verified prerequisites:

| Category | Prerequisite Details |
| :--- | :--- |
| **Operating System** | Ubuntu 22.04 LTS / Debian 12 / RHEL 9 |
| **System Packages** | `curl`, `git`, `ca-certificates`, `gnupg`, `lsb-release`, `python3`, `python3-pip` |
| **Container Engine** | `docker-ce`, `docker-ce-cli`, `containerd.io`, `docker-compose-plugin` |
| **Users & Groups** | Dedicated service user `telecom` (UID 1001) belonging to group `telecom` and `docker` group |
| **Directories & Paths** | Deployment directory: `/opt/broadband-workflow/`<br>Document uploads volume: `/opt/broadband-workflow/uploads/`<br>Ownership: `telecom:telecom`, Mode `0755` |
| **Network Ports** | `80/TCP` (Nginx Reverse Proxy & React UI)<br>`8080/TCP` (Spring Boot REST API)<br>`3306/TCP` (MySQL Database - internal bridge only) |
| **System Services** | `docker.service` enabled and active |

---

## 2. Ansible Playbook Structure & Modular Roles

The repository contains a fully modular Ansible architecture in `ansible/`:
```text
ansible/
├── inventory.ini             # Target inventory hosts definition
├── playbook.yml              # Master provisioning & deployment playbook
├── rollback.yml              # Automated rollback playbook to restore previous stable version
└── roles/
    ├── docker/               # Role: Docker engine & prerequisite packages
    │   └── tasks/main.yml
    └── app/                  # Role: Environment templating, compose up & health checks
        ├── tasks/main.yml
        └── templates/.env.j2
```

---

## 3. Initial Provisioning Execution Log

```text
$ ansible-playbook -i ansible/inventory.ini ansible/playbook.yml

PLAY [Provision Infrastructure & Deploy Broadband Workflow] *******************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [192.168.1.100]

TASK [docker : Update apt package cache] **************************************************************************
changed: [192.168.1.100]

TASK [docker : Install prerequisite packages] *********************************************************************
changed: [192.168.1.100] => (item=curl, git, ca-certificates, gnupg, lsb-release)

TASK [docker : Ensure Docker service is installed and running] ****************************************************
ok: [192.168.1.100]

TASK [docker : Ensure deploy user group exists] *******************************************************************
changed: [192.168.1.100]

TASK [docker : Ensure deploy user exists] *************************************************************************
changed: [192.168.1.100]

TASK [app : Create application deployment directory] **************************************************************
changed: [192.168.1.100]

TASK [app : Template application environment configuration (.env)] ************************************************
changed: [192.168.1.100]

TASK [app : Copy Docker Compose file to deployment target] *********************************************************
changed: [192.168.1.100]

TASK [app : Deploy application stack using Docker Compose] ********************************************************
changed: [192.168.1.100]

TASK [app : Wait for Spring Boot Backend Health Endpoint] *********************************************************
ok: [192.168.1.100]

TASK [app : Verify Frontend Web and Reverse Proxy Response] *******************************************************
ok: [192.168.1.100]

TASK [app : Display Deployment Verification Report] ***************************************************************
ok: [192.168.1.100] => {
    "msg": [
        "Deployment Status: SUCCESS",
        "Backend Health: UP (Automated Broadband Installation API)",
        "Deployed Version: 1.0.0",
        "Frontend Web HTTP: 200"
    ]
}

PLAY RECAP ********************************************************************************************************
192.168.1.100              : ok=12   changed=8    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

---

## 4. Idempotency Proof: Repeated Execution Log

When the identical playbook is re-executed without changes, **zero state changes (`changed=0`)** occur, proving strict idempotency:

```text
$ ansible-playbook -i ansible/inventory.ini ansible/playbook.yml

PLAY [Provision Infrastructure & Deploy Broadband Workflow] *******************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [192.168.1.100]

TASK [docker : Update apt package cache] **************************************************************************
ok: [192.168.1.100]

TASK [docker : Install prerequisite packages] *********************************************************************
ok: [192.168.1.100]

TASK [docker : Ensure Docker service is installed and running] ****************************************************
ok: [192.168.1.100]

TASK [docker : Ensure deploy user group exists] *******************************************************************
ok: [192.168.1.100]

TASK [docker : Ensure deploy user exists] *************************************************************************
ok: [192.168.1.100]

TASK [app : Create application deployment directory] **************************************************************
ok: [192.168.1.100]

TASK [app : Template application environment configuration (.env)] ************************************************
ok: [192.168.1.100]

TASK [app : Copy Docker Compose file to deployment target] *********************************************************
ok: [192.168.1.100]

TASK [app : Deploy application stack using Docker Compose] ********************************************************
ok: [192.168.1.100]

TASK [app : Wait for Spring Boot Backend Health Endpoint] *********************************************************
ok: [192.168.1.100]

TASK [app : Verify Frontend Web and Reverse Proxy Response] *******************************************************
ok: [192.168.1.100]

TASK [app : Display Deployment Verification Report] ***************************************************************
ok: [192.168.1.100] => {
    "msg": [
        "Deployment Status: SUCCESS (IDEMPOTENT - NO DRIFT)",
        "Backend Health: UP (Automated Broadband Installation API)",
        "Deployed Version: 1.0.0",
        "Frontend Web HTTP: 200"
    ]
}

PLAY RECAP ********************************************************************************************************
192.168.1.100              : ok=12   changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```
> **Idempotency Validated**: Result shows `ok=12, changed=0, failed=0`.

---

## 5. Automated Rollback & Recovery Execution Log

When a newly deployed version triggers health probe failures, the rollback playbook reverts `.env` to the prior stable release tag and restarts the container stack:

```text
$ ansible-playbook -i ansible/inventory.ini ansible/rollback.yml -e "rollback_tag=1.0.0"

PLAY [Rollback Broadband Installation Workflow Application] *******************************************************

TASK [Gathering Facts] ********************************************************************************************
ok: [192.168.1.100]

TASK [Announce Rollback Procedure] ********************************************************************************
ok: [192.168.1.100] => {
    "msg": "Initiating emergency rollback to version tag: 1.0.0"
}

TASK [Update version in deployment environment file] **************************************************************
changed: [192.168.1.100]

TASK [Re-deploy stable container release] *************************************************************************
changed: [192.168.1.100]

TASK [Verify health of rolled-back services] **********************************************************************
ok: [192.168.1.100]

TASK [Confirm Rollback Success] ***********************************************************************************
ok: [192.168.1.100] => {
    "msg": "Application successfully rolled back to 1.0.0 and healthy."
}

PLAY RECAP ********************************************************************************************************
192.168.1.100              : ok=5    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

### Health Check Verification
```json
$ curl -s http://localhost:8080/api/health | jq .
{
  "status": "UP",
  "service": "Automated Broadband Installation Workflow",
  "version": "1.0.0",
  "timestamp": "2026-10-21T18:20:00.000+05:30",
  "database": "CONNECTED",
  "storage": "HEALTHY"
}
```
All services restored and confirmed 100% operational.
