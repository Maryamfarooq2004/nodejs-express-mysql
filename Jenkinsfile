pipeline {
    agent any

    environment {
        IMAGE_NAME = "node-app"
        CONTAINER_NAME = "node-app"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                git url: 'https://github.com/Maryamfarooq2004/nodejs-express-mysql.git', branch: 'master'
                sh 'ls -la'
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Run Container') {
            steps {
                sh "docker rm -f ${CONTAINER_NAME} || true"
                sh "docker run -d --name ${CONTAINER_NAME} -p 8081:8080 ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('Verify Container') {
            steps {
                sh 'sleep 5'
                sh "docker ps | grep ${CONTAINER_NAME}"
            }
        }

        stage('Selenium') {
            steps {
                sh "docker build -t selenium-tests -f Dockerfile.selenium ."
                sh "docker run --rm --network host selenium-tests"
            }
        }
    }

    post {
        always {
            sh "docker rm -f ${CONTAINER_NAME} || true"
            echo 'Pipeline finished'
        }
    }
}
