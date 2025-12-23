pipeline {
  agent any

  environment {
    // --- Docker build arguments ---
    VITE_API_URL = "http://<EC2_PUBLIC_IP>:8000/api"  // will be injected into frontend at build time
  }

  stages {
    stage('Checkout Code') {
      steps {
        echo "Cloning the repository..."
        git branch: 'main', url: 'https://github.com/your-github-username/crm.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          echo "Building backend image..."
          sh 'docker build -t crm-backend:latest ./backend'

          echo "Building frontend image with API URL..."
          sh 'docker build --build-arg VITE_API_URL=$VITE_API_URL -t crm-frontend:latest ./frontend'
        }
      }
    }

    stage('Transfer Files to EC2') {
      steps {
        sshagent(['ec2-ssh']) {
          sh '''
          echo "Copying project files to EC2..."
          rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" ./ ubuntu@<EC2_IP>:/home/ubuntu/crm/
          '''
        }
      }
    }

    stage('Deploy on EC2') {
      steps {
        sshagent(['ec2-ssh']) {
          sh '''
          echo "Deploying application on EC2..."
          ssh -o StrictHostKeyChecking=no ubuntu@<EC2_IP> '
            cd /home/ubuntu/crm &&
            echo "Building and starting containers..." &&
            docker compose down &&
            docker compose up -d --build
          '
          '''
        }
      }
    }

    stage('Cleanup (Optional)') {
      steps {
        echo "Cleaning up dangling Docker images..."
        sh 'docker system prune -af || true'
      }
    }
  }

  post {
    success {
      echo " Deployment completed successfully!"
    }
    failure {
      echo "❌ Deployment failed. Check Jenkins logs."
    }
  }
}
