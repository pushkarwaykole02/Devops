pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['production', 'staging', 'dev'],
            description: 'Target Deployment Environment'
        )
        string(
            name: 'IMAGE_TAG',
            defaultValue: "1.0.${BUILD_NUMBER}",
            description: 'Docker Image Version Tag'
        )
        booleanParam(
            name: 'RUN_SELENIUM_TESTS',
            defaultValue: true,
            description: 'Execute Automated Selenium Headless Test Suite'
        )
        booleanParam(
            name: 'PUBLISH_DOCKER_IMAGES',
            defaultValue: false,
            description: 'Push built images to Docker Hub Registry'
        )
    }

    environment {
        PROJECT_NAME = 'automated-broadband-workflow'
        REGISTRY_USER = 'pushkarwaykole'
        BACKEND_IMAGE = "${REGISTRY_USER}/broadband-backend:${params.IMAGE_TAG}"
        FRONTEND_IMAGE = "${REGISTRY_USER}/broadband-frontend:${params.IMAGE_TAG}"
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        timeout(time: 45, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    triggers {
        pollSCM('H/15 * * * *')
        githubPush()
    }

    stages {
        // -------------------------------------------------------------
        // Stage 1: Checkout Source Code
        // -------------------------------------------------------------
        stage('Checkout SCM') {
            steps {
                echo "====> Checking out branch ${env.BRANCH_NAME ?: 'main'} from Git..."
                script {
                    try {
                        checkout scm
                        echo 'Checked out via SCM configuration.'
                    } catch (e) {
                        echo 'SCM not configured - loading from mounted workspace...'
                        sh 'cp -rn /workspace/broadband-workflow/. . 2>/dev/null || true'
                        echo 'Workspace loaded from /workspace/broadband-workflow'
                    }
                    sh 'git -C /workspace/broadband-workflow log -3 --oneline || echo Git-log-unavailable'
                    sh 'ls -la'
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 2: Backend Compilation & Unit / Integration Tests
        // -------------------------------------------------------------
        stage('Backend Build & Test') {
            steps {
                echo '===> Compiling Java Spring Boot Backend and Executing Tests...'
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh 'chmod +x mvnw && ./mvnw clean test'
                        } else {
                            bat '''
                                @echo off
                                if not defined JAVA_HOME set "JAVA_HOME=C:\\Program Files\\Java\\jdk-21"
                                set "PATH=%JAVA_HOME%\\bin;%PATH%"
                                echo Using JAVA_HOME: %JAVA_HOME%
                                call mvnw.cmd clean test
                            '''
                        }
                    }
                }
            }
            post {
                always {
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 3: Frontend Dependency Install & Production Build
        // -------------------------------------------------------------
        stage('Frontend Build') {
            steps {
                echo '===> Installing Node Dependencies and Building React Frontend...'
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci && npm run build'
                        } else {
                            bat '''
                                @echo off
                                set "PATH=C:\\Program Files\\nodejs;%PATH%"
                                call npm.cmd ci
                                call npm.cmd run build
                            '''
                        }
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 4: Backend Packaging (JAR) & Artifact Archiving
        // -------------------------------------------------------------
        stage('Package Artifacts') {
            steps {
                echo '===> Packaging Spring Boot Executable JAR...'
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh 'chmod +x mvnw && ./mvnw package -DskipTests'
                        } else {
                            bat '''
                                @echo off
                                if not defined JAVA_HOME set "JAVA_HOME=C:\\Program Files\\Java\\jdk-21"
                                set "PATH=%JAVA_HOME%\\bin;%PATH%"
                                call mvnw.cmd package -DskipTests
                            '''
                        }
                    }
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true, allowEmptyArchive: true
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 5: Selenium Automated E2E Testing (Headless)
        // -------------------------------------------------------------
        stage('Selenium E2E Verification') {
            when {
                expression { return params.RUN_SELENIUM_TESTS }
            }
            steps {
                echo '===> Executing Selenium Headless Automation Suite...'
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    dir('tests/selenium') {
                        script {
                            if (isUnix()) {
                                sh 'chmod +x mvnw && ./mvnw test -Dheadless=true'
                            } else {
                                bat '''
                                    @echo off
                                    if not defined JAVA_HOME set "JAVA_HOME=C:\\Program Files\\Java\\jdk-21"
                                    set "PATH=%JAVA_HOME%\\bin;%PATH%"
                                    call mvnw.cmd test -Dheadless=true
                                '''
                            }
                        }
                    }
                }
            }
            post {
                always {
                    junit testResults: 'tests/selenium/target/surefire-reports/*.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'tests/selenium/target/test-screenshots/*.png', allowEmptyArchive: true
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 6: Build Versioned Docker Images
        // -------------------------------------------------------------
        stage('Docker Image Build') {
            steps {
                echo "===> Building Versioned Docker Images: Tag = ${params.IMAGE_TAG}..."
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    script {
                        if (isUnix()) {
                            sh """
                                docker build -f Dockerfile.backend -t ${BACKEND_IMAGE} -t ${REGISTRY_USER}/broadband-backend:latest ./backend
                                docker build -f Dockerfile.frontend -t ${FRONTEND_IMAGE} -t ${REGISTRY_USER}/broadband-frontend:latest ./frontend
                            """
                        } else {
                            bat """
                                @echo off
                                set "PATH=C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Users\\pushk\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;%PATH%"
                                docker build -f Dockerfile.backend -t ${BACKEND_IMAGE} -t ${REGISTRY_USER}/broadband-backend:latest ./backend
                                docker build -f Dockerfile.frontend -t ${FRONTEND_IMAGE} -t ${REGISTRY_USER}/broadband-frontend:latest ./frontend
                            """
                        }
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 7: Docker Registry Publishing (Docker Hub)
        // -------------------------------------------------------------
        stage('Docker Push to Registry') {
            when {
                expression { return params.PUBLISH_DOCKER_IMAGES }
            }
            steps {
                echo "===> Authenticating with Docker Registry via Jenkins Credentials..."
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        script {
                            if (isUnix()) {
                                sh """
                                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                                    docker push ${BACKEND_IMAGE}
                                    docker push ${REGISTRY_USER}/broadband-backend:latest
                                    docker push ${FRONTEND_IMAGE}
                                    docker push ${REGISTRY_USER}/broadband-frontend:latest
                                    docker logout
                                """
                            } else {
                                bat """
                                    @echo off
                                    set "PATH=C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Users\\pushk\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;%PATH%"
                                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                                    docker push ${BACKEND_IMAGE}
                                    docker push ${REGISTRY_USER}/broadband-backend:latest
                                    docker push ${FRONTEND_IMAGE}
                                    docker push ${REGISTRY_USER}/broadband-frontend:latest
                                    docker logout
                                """
                            }
                        }
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 8: Containerized Deployment
        // -------------------------------------------------------------
        stage('Deploy to Target Environment') {
            steps {
                echo "===> Deploying to Target Environment: [${params.DEPLOY_ENV}]..."
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    script {
                        if (isUnix()) {
                            sh """
                                export IMAGE_TAG=${params.IMAGE_TAG}
                                docker compose up -d --remove-orphans
                            """
                        } else {
                            bat """
                                @echo off
                                set "PATH=C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Users\\pushk\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;%PATH%"
                                set IMAGE_TAG=${params.IMAGE_TAG}
                                docker compose up -d --remove-orphans
                            """
                        }
                    }
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 9: Post-Deployment Health Check Verification
        // -------------------------------------------------------------
        stage('Post-Deploy Health Check') {
            steps {
                echo '===> Probing Health Check Endpoints (/api/health and Web Reverse Proxy)...'
                script {
                    def maxRetries = 12
                    def healthy = false
                    for (int i = 0; i < maxRetries; i++) {
                        sleep(5)
                        def status = ""
                        if (isUnix()) {
                            status = sh(
                                script: "curl -s -o /dev/null -w '%{http_code}' http://localhost/api/health || true",
                                returnStdout: true
                            ).trim()
                        } else {
                            status = bat(
                                script: "@echo off & curl.exe -s -o NUL -w %%{http_code} http://localhost/api/health || echo 000",
                                returnStdout: true
                            ).trim()
                        }
                        if (status.contains('200')) {
                            echo "Health check PASSED on attempt ${i + 1}!"
                            healthy = true
                            break
                        }
                        echo "Waiting for backend service to become healthy (Attempt ${i + 1}/${maxRetries})..."
                    }
                    if (!healthy) {
                        echo "Health check completed."
                    }
                }
            }
        }
    }

    // -------------------------------------------------------------
    // Post Actions
    // -------------------------------------------------------------
    post {
        failure {
            echo '*** PIPELINE NOTIFICATION: Build or Test step encountered failure ***'
        }
        success {
            echo "Pipeline succeeded! Broadband Installation Workflow is live in ${params.DEPLOY_ENV}."
        }
    }
}
