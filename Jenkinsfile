pipeline {
  agent none
  environment {
    APP_NAME = 'home'
    SERVICE_NAME = 'home'
    DOCKER_REGISTRY = 'bremersee/home'
    DEV_TAG = 'snapshot'
    PROD_TAG = 'latest'
    DOCKER_CREDENTIALS = credentials('dockerhub')
    DEV_BUILD = false
    DEV_DEPLOY = false
    PROD_BUILD = false
    PROD_DEPLOY = false
  }
  options {
    buildDiscarder(logRotator(numToKeepStr: '8', artifactNumToKeepStr: '8'))
  }
  stages {
    stage('Build and push docker image snapshot') {
      agent {
        label 'maven'
      }
      when {
        allOf {
          branch 'develop'
          environment name: 'DEV_BUILD', value: 'true'
        }
      }
      steps {
        script {
          sh '''
            docker build -f Dockerfile --build-arg NG_CONFIG="dev" --build-arg NG_BASE_HREF="/${APP_NAME}/" --build-arg APP_NAME="${APP_NAME}" --build-arg APP_PREFIX="/${APP_NAME}/**" -t ${DOCKER_REGISTRY}:${DEV_TAG} .
            docker login -u="${DOCKER_CREDENTIALS_USR}" -p="${DOCKER_CREDENTIALS_PSW}"
            docker push ${DOCKER_REGISTRY}:${DEV_TAG}
            docker system prune -a -f
          '''
        }
      }
    }
    stage('Deploy on dev-swarm') {
      agent {
        label 'dev-swarm'
      }
      when {
        allOf {
          branch 'develop'
          environment name: 'DEV_DEPLOY', value: 'true'
        }
      }
      steps {
        sh '''
          if docker service ls | grep -q ${SERVICE_NAME}; then
            echo "Updating service ${SERVICE_NAME} with docker image ${DOCKER_REGISTRY}:${DEV_TAG}."
            docker service update --image ${DOCKER_REGISTRY}:${DEV_TAG} ${SERVICE_NAME}
          else
            echo "Creating service ${SERVICE_NAME} with docker image ${DOCKER_REGISTRY}:${DEV_TAG}."
            chmod 755 docker-swarm/service.sh
            docker-swarm/service.sh "${DOCKER_REGISTRY}:${DEV_TAG}" "swarm,dev" 1
          fi
        '''
      }
    }
  }
}
