pipeline {
    agent any

    tools {
        nodejs "node1450"
    }
//

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
    }
}
