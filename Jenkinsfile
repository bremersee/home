pipeline {
  agent none
  environment {
    SERVICE_NAME = 'home'
    DOCKER_REGISTRY = 'bremersee/home'
    DEV_TAG = 'snapshot'
    PROD_TAG = 'latest'
    DOCKER_CREDENTIALS = 'dockerhub'
    DOCKER_IMAGE_WITH_BUILD_NUMBER = ''
    DOCKER_IMAGE_SNAPSHOT = ''
    DOCKER_IMAGE_LATEST = ''
    DEV_BUILD = true
    DEV_PUSH = true
    DEV_DEPLOY = true
    PROD_BUILD = true
    PROD_PUSH = true
    PROD_DEPLOY = true
  }
  stages {
    stage('Build docker image snapshot') {
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
          DOCKER_IMAGE_SNAPSHOT = docker.build DOCKER_REGISTRY + ":$DEV_TAG"
        }
      }
    }
    stage('Push docker image snapshot') {
      agent {
        label 'maven'
      }
      when {
        allOf {
          branch 'develop'
          environment name: 'DEV_BUILD', value: 'true'
          environment name: 'DEV_PUSH', value: 'true'
        }
      }
      steps {
        script {
          docker.withRegistry( '', DOCKER_CREDENTIALS ) {
            DOCKER_IMAGE_SNAPSHOT.push();
          }
        }
      }
    }
    stage('Remove docker image snapshot') {
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
          sh "docker rmi $DOCKER_REGISTRY:$DEV_TAG"
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
