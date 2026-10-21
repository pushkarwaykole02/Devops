# System Architecture & REST API Documentation

**Project**: Automated Broadband Installation Workflow  
**Student**: Pushkar Waykole (Roll No: 23102C0012)  
**Academic Year**: 2026–2027

---

## 1. System Architecture

The application adopts a three-tier decoupled micro-architecture composed of a React SPA presentation layer, a stateless Spring Boot REST API business logic layer with Spring Security & JWT, and a relational persistence layer (MySQL / H2).

```mermaid
graph TB
    subgraph Client ["Client Presentation Tier"]
        Browser["React 18 SPA (Vite / Desktop / Mobile)"]
    end

    subgraph Proxy ["Edge & Reverse Proxy Tier"]
        Nginx["Nginx Reverse Proxy (:80)"]
    end

    subgraph AppTier ["Application Business Logic Tier"]
        SpringBoot["Spring Boot 3 REST API (:8080)"]
        Security["Spring Security + JWT Auth Filter"]
        DocService["Document Storage Service (/app/uploads)"]
        WorkflowEngine["Broadband Workflow Engine"]
    end

    subgraph DataTier ["Data Persistence Tier"]
        DB[("MySQL 8.0 Relational DB / H2 In-Memory")]
        VolDoc[("Persistent Volume: Document Attachments")]
    end

    Browser -->|HTTP/HTTPS| Nginx
    Nginx -->|Static Assets| Browser
    Nginx -->|/api/* & /actuator/*| SpringBoot
    SpringBoot --> Security
    Security --> WorkflowEngine
    Security --> DocService
    WorkflowEngine --> DB
    DocService --> VolDoc
```

---

## 2. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ INSTALLATION_REQUESTS : "submits"
    INSTALLATION_REQUESTS ||--o{ DOCUMENT_ATTACHMENTS : "contains"
    INSTALLATION_REQUESTS ||--o{ AUDIT_LOGS : "tracks"

    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password
        varchar full_name
        varchar phone_number
        varchar role
        datetime created_at
    }

    INSTALLATION_REQUESTS {
        bigint id PK
        varchar request_id UK "e.g. BB-2026-1001"
        bigint customer_id FK
        varchar contact_name
        varchar contact_phone
        varchar contact_email
        varchar address_line1
        varchar address_line2
        varchar city
        varchar state
        varchar postal_code
        date preferred_date
        varchar plan_name
        varchar plan_speed
        double plan_price
        varchar status "SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, INSTALLATION_SCHEDULED"
        varchar reviewer_remarks
        varchar rejection_reason
        date scheduled_date
        varchar assigned_technician
        varchar reviewed_by
        datetime reviewed_at
        datetime created_at
        datetime updated_at
    }

    DOCUMENT_ATTACHMENTS {
        bigint id PK
        bigint request_id FK
        varchar file_name
        varchar original_file_name
        varchar file_type
        bigint file_size
        varchar storage_path
        datetime uploaded_at
    }

    AUDIT_LOGS {
        bigint id PK
        bigint request_id FK
        varchar performed_by_username
        varchar action
        varchar previous_status
        varchar new_status
        varchar remarks
        datetime timestamp
    }
```

---

## 3. REST API Specification

### Authentication & User Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer or reviewer account |
| `POST` | `/api/auth/login` | Public | Authenticate user, receive JWT Bearer token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |

### Broadband Installation Requests
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Customer | Submit new installation request |
| `GET` | `/api/requests/my-requests` | Customer | Fetch logged-in customer's submitted orders |
| `GET` | `/api/requests/{id}` | Customer / Reviewer | Retrieve full request details with documents & audit history |
| `GET` | `/api/requests/reviewer/all` | Reviewer / Admin | List all requests with status and text query filters |
| `PUT` | `/api/requests/reviewer/{id}/review` | Reviewer / Admin | Record review decision (Under Review, Approve, Reject, Schedule) |
| `GET` | `/api/requests/analytics/stats` | Reviewer / Admin | Fetch aggregated operational KPIs |

### Supporting Documents
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/documents/upload/{requestId}` | Customer | Upload KYC or address proof document |
| `GET` | `/api/documents/download/{id}` | Authenticated | Stream / download attached proof file |

### Infrastructure & Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Returns service health status, version, and metadata |
| `GET` | `/actuator/health` | Public | Spring Boot Actuator health check |
