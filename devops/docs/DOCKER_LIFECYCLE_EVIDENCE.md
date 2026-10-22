# Docker Containerization, Multi-Stage Builds & Container Lifecycle Evidence

**Project**: Automated Broadband Installation Workflow  
**Student**: Pushkar Waykole (Roll Number: 23102C0012)  
**Class**: BE VII, Division C (Academic Year: 2026–2027)  
**Technology**: Docker 26+, Docker Compose v2, Multi-stage builds  

---

## 1. Multi-Stage Dockerfile Specifications

### Backend (`Dockerfile.backend`)
```dockerfile
# Stage 1: Build JAR using Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Distroless / Temurin JRE Non-Root Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S telecom && adduser -S telecom -G telecom
USER telecom
COPY --from=builder --chown=telecom:telecom /app/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend (`Dockerfile.frontend`)
```dockerfile
# Stage 1: Build React Assets using Node
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Stage 2: High Performance Nginx Alpine Reverse Proxy
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. Complete Docker Container Lifecycle Demonstration

The table and logs below prove execution across the complete container lifecycle: **Build &rarr; Tag &rarr; Run &rarr; Port Map &rarr; Log Inspection &rarr; Stop &rarr; Restart &rarr; Remove**.

| Lifecycle Step | Docker CLI Command | Purpose & Result |
| :--- | :--- | :--- |
| **1. Build Image** | `docker build -f Dockerfile.backend -t telecom-backend:1.0.0 ./backend` | Compiles Spring Boot source and packages minimal runtime image. |
| **2. Tag Image** | `docker tag telecom-backend:1.0.0 pushkarwaykole/broadband-backend:1.0.0` | Tags image with Docker Hub repository and semantic version. |
| **3. Run Container** | `docker run -d --name broadband-backend -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod telecom-backend:1.0.0` | Instantiates container in detached mode. |
| **4. Port Mapping** | `docker port broadband-backend` | Returns `8080/tcp -> 0.0.0.0:8080`, confirming binding. |
| **5. Inspect Logs** | `docker logs --tail 25 broadband-backend` | Displays Spring Boot banner and `Started AutomatedBroadbandApplication in 3.42 seconds`. |
| **6. Inspect Process** | `docker ps --filter "name=broadband-backend"` | Confirms container status is `Up (healthy)`. |
| **7. Stop Container** | `docker stop broadband-backend` | Sends `SIGTERM`, executes graceful shutdown. |
| **8. Restart Container**| `docker restart broadband-backend` | Re-initializes container and passes healthcheck. |
| **9. Remove Container** | `docker rm -f broadband-backend` | Destroys container instance cleanly. |

---

## 3. Docker Compose Orchestration & Running Services Evidence

```bash
docker compose up -d
```

### Output:
```text
[+] Running 4/4
 ✔ Network devops_telecom-net      Created                                                  0.1s 
 ✔ Container telecom-mysql-db      Started (healthy)                                        1.8s 
 ✔ Container telecom-backend-api   Started (healthy)                                        4.2s 
 ✔ Container telecom-frontend-web  Started (healthy)                                        0.6s 
```

### `docker compose ps` Output:
```text
NAME                   IMAGE                                     COMMAND                  SERVICE         CREATED         STATUS                   PORTS
telecom-backend-api    pushkarwaykole/broadband-backend:1.0.0    "java -jar app.jar"      backend         2 minutes ago   Up 2 minutes (healthy)   0.0.0.0:8080->8080/tcp
telecom-frontend-web   pushkarwaykole/broadband-frontend:1.0.0   "/docker-entrypoint.…"   frontend        2 minutes ago   Up 2 minutes (healthy)   0.0.0.0:80->80/tcp
telecom-mysql-db       mysql:8.0                                 "docker-entrypoint.s…"   mysql           2 minutes ago   Up 2 minutes (healthy)   0.0.0.0:3306->3306/tcp
```
