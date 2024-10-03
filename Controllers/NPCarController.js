// controllers/NPCarController.js
import { NPCar } from '../objects/NPCar.js';

export class NPCarController {
    constructor(scene, car) {
        this.scene = scene;
        this.car = car;
        this.npCars = [];
        this.createNPCar(); // Создание первой NPC машины

        // Создаем новую NPC машину каждые 3 секунды
        setInterval(() => this.createNPCar(), 3000);
    }

    createNPCar() {
        const lanes = [-2, 0, 2];
        const initialX = lanes[Math.floor(Math.random() * lanes.length)];
        const npCar = new NPCar(initialX);  // Создаем NPC машину

        // Добавляем её в сцену и массив машин
        this.scene.add(npCar.mesh);
        this.npCars.push(npCar);
    }

    update(cameraZ, handleCollision) {
        this.npCars.forEach((npCar, index) => {
            npCar.update();

            // Проверка на столкновение с машиной игрока
            const distance = npCar.mesh.position.distanceTo(this.car.mesh.position);
            if (distance < 1.5) {
                handleCollision(); // Вызываем обработчик столкновения
                this.scene.remove(npCar.mesh); // Удаляем машину из сцены
                this.npCars.splice(index, 1); // Удаляем машину из массива
            }

            // Удаляем NPC машину, если она позади игрока
            if (npCar.mesh.position.z > cameraZ + 5) {
                this.scene.remove(npCar.mesh);
                this.npCars.splice(index, 1);
            }
        });
    }
}