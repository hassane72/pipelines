pipeline {
    agent any

    tools {
        nodejs "node1450"
    }
    environment {
        VERSION = "v1"
        MAINTAINER = "modelisgroup"
        DOCKER_IMAGE_NAME = "productivity-frontend"
        BUILD_TAG = "prod-${VERSION}"
    }

    stages {
        stage('Get node and npm version') {
            parallel {
                stage('Check NODE') {
                    steps {
                        sh "node --version"
                    }
                }
                stage('Check NPM') {
                    steps {
                        sh 'npm --version'
                    }
                }
            }
        }
        stage('Build docker latest image') {
            steps {
                sh "docker build -t ${MAINTAINER}/${DOCKER_IMAGE_NAME}:prod-latest ."
            }
        }
        stage('Push latest image to the Hub Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-login', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                    sh "docker push ${MAINTAINER}/${DOCKER_IMAGE_NAME}:prod-latest"
                }
            }
        }
        stage('Build current version docker image') {
            steps {
                sh "docker build -t ${MAINTAINER}/${DOCKER_IMAGE_NAME}:${BUILD_TAG} ."
            }
        }
        stage("Push current image to the Hub Docker") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-login', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                    sh "docker push ${MAINTAINER}/${DOCKER_IMAGE_NAME}:${BUILD_TAG}"
                }
            }
        }
    }
}
