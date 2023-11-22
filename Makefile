docker-up:
	@echo "Building docker image..."
	@docker compose up -d --build
	@echo "Docker image built successfully"

docker-down:
	@echo "Stopping docker image..."
	@docker compose down
	@echo "Docker image stopped successfully"

docker-restart:
	@echo "Restarting docker image..."
	@docker compose down
	@docker compose up -d --build
	@echo "Docker image restarted successfully"

docker-logs:
	@echo "Showing docker logs..."
	@docker compose logs -f

docker-bash:
	@echo "Opening bash..."
	@docker exec -it $(APP_NAME) bash

docker-ps:
	@echo "Showing docker ps..."
	@docker ps

docker-psa:
	@echo "Showing docker ps..."
	@docker ps -a

docker-rm:
	@echo "Removing docker image..."
	@docker rm $(APP_NAME)
	@echo "Docker image removed successfully"

docker-rmi:
	@echo "Removing docker image..."
	@docker rmi $(APP_NAME)
	@echo "Docker image removed successfully"

docker-rmi-all:
	@echo "Removing all docker images..."
	@docker rmi $$(docker images -q)
	@echo "All docker images removed successfully"

docker-prune:
	@echo "Pruning docker system..."
	@docker system prune -a
	@echo "Docker system pruned successfully"

docker-prune-volumes:
	@echo "Pruning docker volumes..."
	@docker volume prune
	@echo "Docker volumes pruned successfully"

docker-prune-images:
	@echo "Pruning docker images..."
	@docker image prune
	@echo "Docker images pruned successfully"

docker-prune-containers:
	@echo "Pruning docker containers..."
	@docker container prune
	@echo "Docker containers pruned successfully"

docker-prune-networks:
	@echo "Pruning docker networks..."
	@docker network prune
	@echo "Docker networks pruned successfully"

docker-prune-all:
	@echo "Pruning all docker..."
	@docker system prune -a
	@docker volume prune
	@docker image prune
	@docker container prune
	@docker network prune
	@echo "All docker pruned successfully"