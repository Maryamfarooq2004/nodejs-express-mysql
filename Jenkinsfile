pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        DOCKER_IMAGE = 'nodejs-express-mysql'
        DOCKER_CONTAINER = 'node-app'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    pwd
                    ls -la
                    test -f package.json

                    docker run --rm \
                        -v "$WORKSPACE":/app \
                        -w /app \
                        node:20-alpine \
                        sh -lc "npm install"
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    test -f package.json

                    docker run --rm \
                        -v "$WORKSPACE":/app \
                        -w /app \
                        node:20-alpine \
                        sh -lc "npm test"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    test -S /var/run/docker.sock || (echo 'Docker socket is not mounted into Jenkins' && exit 1)
                    docker build --no-cache -t node-app:latest .
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    test -S /var/run/docker.sock || (echo 'Docker socket is not mounted into Jenkins' && exit 1)
                    docker rm -f node-app || true

                    docker run -d \
                        -p 8081:8080 \
                        --name node-app \
                        node-app:latest
                '''
            }
        }

        stage('Verify Container') {
            steps {
                sh 'docker ps -a'
            }
        }

        stage('Selenium') {
            when {
                expression { fileExists('Dockerfile.selenium') }
            }
            steps {
                sh '''
                    test -S /var/run/docker.sock || (echo 'Docker socket is not mounted into Jenkins' && exit 1)
                    docker build -f Dockerfile.selenium -t ${DOCKER_IMAGE}-selenium:latest .
                '''
                sh '''
                    docker run --rm --network host \
                        -e BASE_URL=http://localhost:8081 \
                        -e CHROME_BINARY_PATH=/usr/bin/chromium \
                        ${DOCKER_IMAGE}-selenium:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
        always {
            sh '''
                if command -v docker >/dev/null 2>&1; then
                    docker rm -f node-app || true
                fi
            '''
        }
    }
}
