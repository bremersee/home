pipeline {
  agent none
  environment {
    SERVICE_NAME='home'
    DOCKER_REGISTRY='bremersee/home'
    DEV_TAG='latest'
    PROD_TAG='release'
    DOCKER_CREDENTIALS = 'dockerhub'
    DOCKER_IMAGE_WITH_BUILD_NUMBER=''
    DOCKER_IMAGE_LATEST=''
    DOCKER_IMAGE_RELEASE=''
  }
  stages {
    stage('Build docker image latest') {
      agent {
        label 'maven'
      }
      when {
        branch 'develop'
      }
      steps {
        script {
          DOCKER_IMAGE_LATEST = docker.build DOCKER_REGISTRY + ":$DEV_TAG"
        }
      }
    }
    stage('Push docker image latest') {
      agent {
        label 'maven'
      }
      when {
        branch 'develop'
      }
      steps {
        script {
          docker.withRegistry( '', DOCKER_CREDENTIALS ) {
            DOCKER_IMAGE_LATEST.push();
          }
        }
      }
    }
    stage('Remove docker image latest') {
      agent {
        label 'maven'
      }
      when {
        branch 'develop'
      }
      steps {
        script {
          sh "docker rmi $DOCKER_REGISTRY:$DEV_TAG"
        }
      }
    }
    stage('Deploy on dev-swarm') {
      agent {
        label 'dev-swarm'
      }
      when {
        branch 'develop'
      }
      steps {
        sh '''
          if docker service ls | grep -q ${SERVICE_NAME}; then
            echo "Updating service ${SERVICE_NAME} with docker image ${DOCKER_REGISTRY}:${DEV_TAG}."
            docker service update --image ${DOCKER_REGISTRY}:${DEV_TAG} ${SERVICE_NAME}
          else
            echo "Creating service ${SERVICE_NAME} with docker image ${DOCKER_REGISTRY}:${DEV_TAG}."
            chmod 755 docker-swarm/service.sh
            docker-swarm/service.sh "${DOCKER_REGISTRY}:${DEV_TAG}"
          fi
        '''
      }
    }
  }
}
