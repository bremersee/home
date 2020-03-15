#!/usr/bin/env sh
docker service create \
  --replicas 1 \
  --name home \
  --hostname home \
  --network proxy \
  --label com.df.notify=true \
  --label com.df.servicePath=/home \
  --label com.df.port=80 \
  --restart-delay 10s \
  --restart-max-attempts 10 \
  --restart-window 60s \
  --update-delay 10s \
  --constraint 'node.role == worker' \
  $1
