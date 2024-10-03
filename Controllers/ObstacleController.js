// controllers/ObstacleController.js
import { Obstacle } from '../objects/Obstacle.js';

export class ObstacleController {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
        this.createObstacle();

        // Создаём препятствия каждые 2 секунды
        setInterval(() => this.createObstacle(), 2000);
    }

    createObstacle() {
        const obstacle = new Obstacle();
        this.scene.add(obstacle.mesh);
        this.obstacles.push(obstacle);
    }

    update(speed, car, cameraZ, handleCollision) { // Добавили cameraZ
        this.obstacles.forEach((obstacle, index) => {
            obstacle.update(speed);

            // Проверка на столкновение
            if (obstacle.mesh.position.distanceTo(car.mesh.position) < 1) {
                handleCollision();
                this.scene.remove(obstacle.mesh);
                this.obstacles.splice(index, 1);
            }

            // Удаляем препятствие, если оно позади камеры
            if (obstacle.mesh.position.z > cameraZ + 5) { // Используем cameraZ
                this.scene.remove(obstacle.mesh);
                this.obstacles.splice(index, 1);
            }
        });
    }
}