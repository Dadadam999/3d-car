// core/Game.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';
import { Car } from '../objects/Car.js';
import { Lighting } from '../core/Lighting.js';
import { Sky } from '../core/Sky.js';
import { Controls } from '../core/Controls.js';
import { RoadController } from '../controllers/RoadController.js';
import { NPCarController } from '../controllers/NPCarController.js';
import { BuildingController } from '../controllers/BuildingController.js';
import { ExplosionController } from '../controllers/ExplosionController.js';
import { ObstacleController } from '../controllers/ObstacleController.js';
import { TrafficLightController } from '../controllers/TrafficLightController.js'; // Импортируем TrafficLightController
import { GroundController } from '../controllers/GroundController.js'; // Импортируем GroundController
import { LineController } from '../controllers/LineController.js'; // Импортируем LineController
import { UI } from '../core/UI.js';

export class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB);

        // Скорость и ускорение
        this.speed = 0;
        this.maxSpeed = 1.0;
        this.acceleration = 0.4;

        // Жизни
        this.lives = 30;

        // Освещение и небо
        this.lighting = new Lighting(this.scene);
        this.sky = new Sky(this.scene);

        // UI
        this.ui = new UI();

        // Создаем машину игрока до создания контроллеров NPC
        this.createCar();
        
        this.controls = new Controls(this.car);

        // Контроллеры объектов
        this.roadController = new RoadController(this.scene);
        this.npCarController = new NPCarController(this.scene, this.car);
        this.buildingController = new BuildingController(this.scene);
        this.explosionController = new ExplosionController(this.scene);
        this.obstacleController = new ObstacleController(this.scene);
        this.trafficLightController = new TrafficLightController(this.scene); // Инициализация TrafficLightController
        this.groundController = new GroundController(this.scene); // Инициализация GroundController
        this.lineController = new LineController(this.scene); // Инициализация LineController

        // Создаем объект THREE.Clock для отслеживания времени
        this.clock = new THREE.Clock();

        // Привязка методов
        this.animate = this.animate.bind(this);

        // Инициализация события изменения размера окна
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    init() {
        this.setupCamera();
    }

    setupCamera() {
        this.camera.position.z = 5;
        this.camera.position.y = 2;
        this.camera.lookAt(new THREE.Vector3(0, 0, -10));
    }

    createCar() {
        this.car = new Car();
        this.scene.add(this.car.mesh);
    }

    animate() {
        requestAnimationFrame(this.animate);

        const deltaTime = this.clock.getDelta(); // Получаем время между кадрами

        // Обновление всех контроллеров
        this.update(deltaTime);

        // Рендеринг сцены
        this.renderer.render(this.scene, this.camera);
    }

    update(deltaTime) {
        this.updateSpeed(deltaTime);

        this.controls.update();
        // Обновляем объекты через контроллеры
        this.roadController.update(this.speed, this.camera.position.z);
        this.npCarController.update(this.camera.position.z, () => this.handleCollision());
        this.buildingController.update(this.speed, this.camera.position.z);
        this.obstacleController.update(this.speed, this.car, this.camera.position.z, () => this.handleCollision());
        this.explosionController.update(deltaTime);
        this.trafficLightController.update(this.speed, this.camera.position.z); // Обновляем TrafficLightController
        this.groundController.update(this.speed, this.camera.position.z); // Обновляем GroundController
        this.lineController.update(this.speed, this.camera.position.z); // Обновляем LineController

        // Обновляем день/ночь и UI
        this.lighting.updateDayNightCycle(deltaTime);
        this.sky.updateSkyColor(this.lighting.timeOfDay); // Используем переменную из Lighting
        this.ui.update(this.lives, this.speed); // Обновляем UI
    }

    // core/Game.js

updateSpeed(deltaTime) {
    // Увеличиваем скорость до максимальной
    this.speed += this.acceleration * deltaTime;
    if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed;
    }

    // Применяем модификатор скорости машины
    this.speed *= this.car.getSpeedModifier();
}

    handleCollision() {
        this.lives -= 1;
        this.speed = 0; // Сбрасываем скорость

        // Сбрасываем флаги управления
        this.controls.moveLeft = false;
        this.controls.moveRight = false;

        // Создаем взрыв на месте столкновения
        this.explosionController.createExplosion(this.car.mesh.position);

        if (this.lives <= 0) {
            alert('Игра окончена!');
            window.location.reload();
        }
    }

    onWindowResize() {
        // Обработка изменения размера окна
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}