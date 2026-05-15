pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nodejs-express-mysql'
        DOCKER_CONTAINER = 'nodejs-express-mysql-ci'
    }

    stages {

        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'pwd && ls -la'
                sh '''
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
                    docker run --rm \
                        -v "$WORKSPACE":/app \
                        -w /app \
                        node:20-alpine \
                        sh -lc "npm test"
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'docker build --no-cache -t nodejs-express-mysql .'
            }
        }

        stage('Run') {
            steps {
                sh '''
                    docker rm -f nodejs-app || true

                    docker run -d \
                        -p 8081:8080 \
                        --name nodejs-app \
                        nodejs-express-mysql
                '''
            }
        }

        stage('Selenium') {
            steps {
                sh 'docker build -f Dockerfile.selenium -t ${DOCKER_IMAGE}-selenium:latest .'
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
                    docker rm -f nodejs-app || true
                fi
            '''
        }
    }
}
