pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nodejs-express-mysql'
        DOCKER_CONTAINER = 'nodejs-express-mysql-ci'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:latest .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    docker stop ${DOCKER_CONTAINER} || true
                    docker rm ${DOCKER_CONTAINER} || true

                    docker run -d \
                    --name ${DOCKER_CONTAINER} \
                    -p 8081:8080 \
                    ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Verify Container') {
            steps {
                sh 'docker ps'
            }
        }

        stage('Selenium Tests') {
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
                    docker rm -f ${DOCKER_CONTAINER} || true
                fi
            '''
        }
    }
}
