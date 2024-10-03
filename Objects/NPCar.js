// objects/NPCar.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class NPCar {
    constructor(initialX = 0) {
        this.mesh = new THREE.Group();

        // Создаем группу для корпуса и кабины
        this.carGroup = new THREE.Group();

        // Основная часть машины (корпус)
        const carBodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
        const carBodyMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // Синий цвет для отличия
        this.carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        this.carBody.position.y = 0.25;
        this.carGroup.add(this.carBody);

        // Кабина
        const cabinGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.8);
        const cabinMaterial = new THREE.MeshLambertMaterial({ color: 0x5555ff });
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

        // Поворотники - Перемещаем их ближе к капоту
        this.turnSignalLeft = this.createTurnSignal(-0.6, 0.4, -0.7); // Ближе к капоту
        this.turnSignalRight = this.createTurnSignal(0.6, 0.4, -0.7); // Ближе к капоту

        // Добавляем поворотники к машине
        this.carGroup.add(this.turnSignalLeft);
        this.carGroup.add(this.turnSignalRight);

        // Устанавливаем начальную позицию
        this.mesh.position.y = 0;
        this.mesh.position.x = initialX;
        this.mesh.position.z = -200; // Начинаем далеко впереди игрока

        // Поворачиваем машину на 180 градусов, чтобы она была направлена к игроку
        this.mesh.rotation.y = Math.PI;

        // Скорость движения
        this.speed = 0.5;

        // Целевая позиция по X для перестроения
        this.targetPositionX = this.mesh.position.x;

        // Состояние поворотников
        this.isBlinking = false;
        this.blinkInterval = null;
        this.currentBlinkState = false; // Текущее состояние поворотника (включен/выключен)

        // Планирование смены полосы
        this.planLaneChange();
    }

    createTurnSignal(x, y, z) {
        const signalGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const signalMaterial = new THREE.MeshStandardMaterial({
            color: 0xffa500,
            emissive: 0xffa500,
            emissiveIntensity: 0,
            toneMapped: false
        });
        const signal = new THREE.Mesh(signalGeometry, signalMaterial);
        signal.position.set(x, y, z);
        return signal;
    }

    planLaneChange() {
        // Планируем смену полосы через случайное время от 3 до 5 секунд
        const timeUntilLaneChange = Math.random() * 2000 + 3000; // От 3 до 5 секунд
        setTimeout(() => {
            // Выбираем сторону для перестроения
            const lanes = [-2, 0, 2];
            const currentLaneIndex = lanes.indexOf(this.targetPositionX);
            let possibleLanes = lanes.filter((lane, index) => index !== currentLaneIndex);
            this.nextLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];

            // Начинаем мигание поворотника
            this.startBlinking();

            // Через 3 секунды выполняем перестроение
            setTimeout(() => {
                this.changeLane();
            }, 3000);
        }, timeUntilLaneChange);
    }

    startBlinking() {
        this.isBlinking = true;
        const blinkIntervalTime = 500; // Интервал мигания в миллисекундах

        this.blinkInterval = setInterval(() => {
            this.currentBlinkState = !this.currentBlinkState;
            const emissiveIntensity = this.currentBlinkState ? 5 : 0; // Увеличиваем яркость до 5

            if (this.nextLane < this.targetPositionX) {
                // Поворот направо (помните, машина развернута, поэтому правый поворотник теперь левый)
                this.turnSignalRight.material.emissiveIntensity = emissiveIntensity;
            } else {
                // Поворот налево (машина развернута, левый поворотник теперь правый)
                this.turnSignalLeft.material.emissiveIntensity = emissiveIntensity;
            }
        }, blinkIntervalTime);
    }

    stopBlinking() {
        this.isBlinking = false;
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;
        this.currentBlinkState = false;
        // Выключаем поворотники
        this.turnSignalLeft.material.emissiveIntensity = 0;
        this.turnSignalRight.material.emissiveIntensity = 0;
    }

    changeLane() {
        // Устанавливаем новую целевую позицию по X
        this.targetPositionX = this.nextLane;
        this.nextLane = null;

        // Останавливаем мигание поворотника
        this.stopBlinking();

        // Планируем следующую смену полосы
        this.planLaneChange();
    }

    update() {
        // Движение навстречу игроку по оси Z
        this.mesh.position.z += this.speed;

        // Плавное перестроение по оси X
        this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, this.targetPositionX, 0.05);

        // Вращение колес
        this.frontWheels.forEach(({ wheel }) => {
            wheel.rotation.x += 0.2;
        });
        this.backWheels.forEach(wheel => {
            wheel.rotation.x += 0.2;
        });
    }
}