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
                sh 'npm ci'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    docker rm -f ${DOCKER_CONTAINER} || true
                    docker run -d --name ${DOCKER_CONTAINER} -p 8080:8080 ${DOCKER_IMAGE}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Selenium Tests') {
            steps {
                echo 'Optional Selenium stage placeholder. Add browser tests here later.'
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
            sh 'docker rm -f ${DOCKER_CONTAINER} || true'
        }
    }
}
