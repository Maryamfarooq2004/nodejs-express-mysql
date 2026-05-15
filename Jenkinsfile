pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/Maryamfarooq2004/nodejs-express-mysql.git'
            }
        }

        stage('Install') {
            steps {
                sh '''
                    set -e

                    echo "WORKSPACE=$WORKSPACE"
                    ls -la $WORKSPACE
                    echo "Checking package.json..."
                    cat $WORKSPACE/package.json
                    test -f $WORKSPACE/package.json || (echo "package.json missing" && exit 1)
                    test -S /var/run/docker.sock || (echo 'Docker socket is not mounted into Jenkins' && exit 1)

                    docker run --rm \
                        -v "$WORKSPACE:/workspace" \
                        -w /workspace \
                        node:20-alpine \
                        sh -lc "ls -la && cat package.json && npm install"
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    set -e
                    test -S /var/run/docker.sock || (echo 'Docker socket is not mounted into Jenkins' && exit 1)

                    docker run --rm \
                        -v "$WORKSPACE:/workspace" \
                        -w /workspace \
                        node:20-alpine \
                        sh -lc "npm test"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    set -e
                    test -S /var/run/docker.sock || (echo 'Docker socket is not mounted into Jenkins' && exit 1)
                    docker build --no-cache -t node-app:latest .
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    set -e
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
                    docker build -f Dockerfile.selenium -t nodejs-express-mysql-selenium:latest .
                '''
                sh '''
                    docker run --rm --network host \
                        -e BASE_URL=http://localhost:8081 \
                        -e CHROME_BINARY_PATH=/usr/bin/chromium \
                        nodejs-express-mysql-selenium:latest
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
