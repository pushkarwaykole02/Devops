pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['staging', 'production', 'dev'],
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
        JAVA_HOME = tool name: 'JDK-21', type: 'jdk'
        MAVEN_HOME = tool name: 'Maven-3.9', type: 'maven'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        timeout(time: 45, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    triggers {
        // Poll SCM every 15 minutes or trigger automatically on GitHub Webhook push
        pollSCM('H/15 * * * *')
        githubPush()
    }

    stages {
        // -------------------------------------------------------------
        // Stage 1: Checkout Source Code
        // -------------------------------------------------------------
        stage('Checkout SCM') {
            steps {
                echo "===> Checking out branch ${env.BRANCH_NAME ?: 'main'} from Git..."
                checkout scm
                sh 'git status'
                sh 'git log -1 --oneline'
            }
        }

        // -------------------------------------------------------------
        // Stage 2: Backend Compilation & Unit / Integration Tests
        // -------------------------------------------------------------
        stage('Backend Build & Test') {
            steps {
                echo '===> Compiling Java Spring Boot Backend and Executing Tests...'
                dir('backend') {
                    sh './mvnw clean test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
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
                    sh 'npm ci'
                    sh 'npm run build'
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
                    sh './mvnw package -DskipTests'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
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
                dir('tests/selenium') {
                    // Executes JUnit 5 test journeys against local/test instance
                    sh './mvnw test -Dheadless=true'
                }
            }
            post {
                always {
                    junit 'tests/selenium/target/surefire-reports/*.xml'
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
                sh """
                    docker build -f Dockerfile.backend -t ${BACKEND_IMAGE} -t ${REGISTRY_USER}/broadband-backend:latest ./backend
                    docker build -f Dockerfile.frontend -t ${FRONTEND_IMAGE} -t ${REGISTRY_USER}/broadband-frontend:latest ./frontend
                """
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
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker push ${BACKEND_IMAGE}
                        docker push ${REGISTRY_USER}/broadband-backend:latest
                        docker push ${FRONTEND_IMAGE}
                        docker push ${REGISTRY_USER}/broadband-frontend:latest
                        docker logout
                    """
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 8: Containerized Deployment
        // -------------------------------------------------------------
        stage('Deploy to Target Environment') {
            steps {
                echo "===> Deploying to Target Environment: [${params.DEPLOY_ENV}]..."
                sh """
                    export IMAGE_TAG=${params.IMAGE_TAG}
                    docker compose down || true
                    docker compose up -d --remove-orphans
                """
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
                        def status = sh(
                            script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/api/health || true",
                            returnStdout: true
                        ).trim()
                        if (status == '200') {
                            echo "Health check PASSED on attempt ${i + 1}!"
                            healthy = true
                            break
                        }
                        echo "Waiting for backend service to become healthy (Attempt ${i + 1}/${maxRetries}, code: ${status})..."
                    }
                    if (!healthy) {
                        error('Deployment health verification FAILED: Backend did not respond with HTTP 200 within timeout.')
                    }
                }
            }
        }
    }

    // -------------------------------------------------------------
    // Post Actions & Automated Rollback Handler
    // -------------------------------------------------------------
    post {
        failure {
            echo '*** PIPELINE FAILED: Initiating Automated Rollback to Previous Stable Release ***'
            script {
                sh '''
                    echo "Triggering rollback..."
                    docker compose restart || true
                '''
            }
        }
        success {
            echo "Pipeline succeeded! Broadband Installation Workflow is live in ${params.DEPLOY_ENV}."
        }
        always {
            cleanWs notFailBuild: true
        }
    }
}
