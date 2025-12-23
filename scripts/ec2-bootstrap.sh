#!/usr/bin/env bash
set -e
# run as sudo

# update
apt-get update -y

# install docker
apt-get install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# allow ubuntu user to run docker without sudo (adjust if different user)
usermod -aG docker ubuntu

# create remote dir
mkdir -p /home/ubuntu/crm
chown ubuntu:ubuntu /home/ubuntu/crm

echo "Bootstrap finished. Log out and log in again (or run: newgrp docker) to get docker group permissions."
