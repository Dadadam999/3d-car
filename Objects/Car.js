// objects/Car.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Car {
    constructor() {
        this.mesh = new THREE.Group();

        // Создаем группу для корпуса и кабины
        this.carGroup = new THREE.Group();

        // Основная часть машины (корпус)
        const carBodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
        const carBodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        this.carBody.position.y = 0.25;
        this.carGroup.add(this.carBody);

        // Кабина
        const cabinGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.8);
        const cabinMaterial = new THREE.MeshLambertMaterial({ color: 0xff5555 });
        this.cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        this.cabin.position.y = 0.55;
        this.cabin.position.z = -0.3;
        this.carGroup.add(this.cabin);

        // Добавляем группу корпуса в основную группу
        this.mesh.add(this.carGroup);

        // Колеса
        const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

        // Массивы для хранения колес
        this.frontWheels = [];
        this.backWheels = [];

        // Позиции колес: [x, y, z]
        const wheelPositions = [
            [-0.5, 0.1, 0.8, 'back'],   // Заднее левое
            [0.5, 0.1, 0.8, 'back'],    // Заднее правое
            [-0.5, 0.1, -0.8, 'front'], // Переднее левое
            [0.5, 0.1, -0.8, 'front']   // Переднее правое
        ];

        wheelPositions.forEach(position => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(0, 0, 0); // Центрируем колесо в его группе

            if (position[3] === 'front') {
                // Создаем группу для переднего колеса
                const wheelGroup = new THREE.Group();
                wheelGroup.add(wheel);
                wheelGroup.position.set(position[0], position[1], position[2]);
                this.carGroup.add(wheelGroup);
                this.frontWheels.push({ wheel, wheelGroup });
            } else {
                // Задние колёса
                wheel.position.set(position[0], position[1], position[2]);
                this.carGroup.add(wheel);
                this.backWheels.push(wheel);
            }
        });

        // Начальные значения поворотов
        this.targetRotationZ = 0; // Наклон кузова
        this.targetRotationY = 0; // Поворот кузова
        this.wheelRotationY = 0;  // Поворот передних колёс

        // Начальные значения позиции
        this.targetPositionX = 0;

        // Модификатор скорости
        this.speedModifier = 0.1; // При повороте уменьшается

        // Привязка метода update
        this.update = this.update.bind(this);
    }

    update(moveLeft, moveRight) {
        const maxPositionX = 3; // Ограничение по X

        // Определяем целевые значения
        if (moveLeft) {
            this.targetRotationZ = 0.1; // Наклон влево
            this.targetRotationY = 0.2; // Поворот кузова влево
            this.wheelRotationY = 0.5;  // Поворот передних колёс влево
            this.targetPositionX -= 0.05; // Движение влево
            this.speedModifier = 0.98; // Уменьшаем скорость при повороте
        } else if (moveRight) {
            this.targetRotationZ = -0.1; // Наклон вправо
            this.targetRotationY = -0.2; // Поворот кузова вправо
            this.wheelRotationY = -0.5;  // Поворот передних колёс вправо
            this.targetPositionX += 0.05; // Движение вправо
            this.speedModifier = 0.98; // Уменьшаем скорость при повороте
        } else {
            this.targetRotationZ = 0;   // Возвращаемся в исходное положение
            this.targetRotationY = 0;
            this.wheelRotationY = 0;
            this.speedModifier = 1.0; // Восстанавливаем скорость
        }

        // Ограничение движения машины по оси X
        if (this.targetPositionX < -maxPositionX) {
            this.targetPositionX = -maxPositionX;
        }
        if (this.targetPositionX > maxPositionX) {
            this.targetPositionX = maxPositionX;
        }

        // Плавно интерполируем текущий наклон и поворот к целевому
        this.carGroup.rotation.z = THREE.MathUtils.lerp(this.carGroup.rotation.z, this.targetRotationZ, 0.1);
        this.carGroup.rotation.y = THREE.MathUtils.lerp(this.carGroup.rotation.y, this.targetRotationY, 0.1);

        // Поворачиваем передние колёса
        this.frontWheels.forEach(({ wheel, wheelGroup }) => {
            wheelGroup.rotation.y = THREE.MathUtils.lerp(wheelGroup.rotation.y, this.wheelRotationY, 0.1);
            wheel.rotation.x -= 0.2; // Вращение колеса
        });

        // Вращение задних колёс
        this.backWheels.forEach(wheel => {
            wheel.rotation.x -= 0.2; // Вращение колеса
        });

        // Плавно интерполируем позицию машины по X
        this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, this.targetPositionX, 0.1);
    }

    // Метод для получения модификатора скорости
    getSpeedModifier() {
        return this.speedModifier;
    }

    // Метод для проверки, поворачивает ли машина
    isTurning() {
        return this.speedModifier < 1.0;
    }
}