// Sky.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Sky {
    constructor(scene) {
        this.scene = scene;

        // Создаём сферу для неба
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
        this.sky = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(this.sky);

        // Создаём солнце
        const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(this.sun);

        // Создаём луну
        const moonGeometry = new THREE.SphereGeometry(15, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        scene.add(this.moon);

        // Переменные для погоды
        this.currentWeather = 'clear'; // Возможные значения: 'clear', 'fog', 'rain'
        this.weatherChangeInterval = 60; // Каждые 60 секунд меняем погоду
        this.weatherTimer = 0;

        // Туман
        this.fog = new THREE.Fog(0x000000, 10, 500);

        // Дождь
        this.createRain();

        // Фактор дня
        this.dayFactor = 0;
    }

    createRain() {
        // Создаем геометрию для дождя
        const rainGeometry = new THREE.BufferGeometry();
        const rainCount = 15000;
        const positions = [];
        for (let i = 0; i < rainCount; i++) {
            positions.push(
                (Math.random() - 0.5) * 1000,
                Math.random() * 500,
                (Math.random() - 0.5) * 1000
            );
        }
        rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        // Создаем материал для дождя
        const rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.2,
            transparent: true
        });

        this.rain = new THREE.Points(rainGeometry, rainMaterial);
        this.rain.visible = false; // Начинаем с невидимого дождя
        this.scene.add(this.rain);
    }

    updateSkyColor(timeOfDay) {
        // Увеличиваем продолжительность ночи
        // Пусть ночь длится в два раза дольше дня
        const adjustedTime = (timeOfDay * 2) % 1; // Значение от 0 до 1

        // Вычисляем фактор дня
        if (adjustedTime < 0.25) {
            // Рассвет
            this.dayFactor = adjustedTime / 0.25;
        } else if (adjustedTime < 0.75) {
            // День
            this.dayFactor = 1;
        } else {
            // Закат
            this.dayFactor = 1 - (adjustedTime - 0.75) / 0.25;
        }

        // Вычисляем цвет неба
        const dayColor = new THREE.Color(0x87CEEB); // Голубое небо
        const nightColor = new THREE.Color(0x000022); // Темное небо
        this.sky.material.color.lerpColors(nightColor, dayColor, this.dayFactor);

        // Обновляем позиции солнца и луны
        const sunAngle = adjustedTime * Math.PI * 2;
        this.sun.position.set(
            Math.cos(sunAngle) * 400,
            Math.sin(sunAngle) * 400,
            -100
        );

        const moonAngle = sunAngle + Math.PI; // Луна противоположна солнцу
        this.moon.position.set(
            Math.cos(moonAngle) * 400,
            Math.sin(moonAngle) * 400,
            -100
        );

        // Видимость солнца и луны
        this.sun.visible = this.dayFactor > 0;
        this.moon.visible = this.dayFactor < 1;
    }

    // Добавляем метод для обновления погоды
    updateWeather(deltaTime) {
        this.weatherTimer += deltaTime;
        if (this.weatherTimer >= this.weatherChangeInterval) {
            this.weatherTimer = 0;
            this.changeWeather();
        }

        // Обновляем дождь, если идет дождь
        if (this.currentWeather === 'rain') {
            this.updateRain(deltaTime);
        }
    }

    changeWeather() {
        const weatherOptions = ['clear', 'fog', 'rain'];
        this.currentWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

        // Обновляем туман в сцене
        if (this.currentWeather === 'fog') {
            this.scene.fog = this.fog;
        } else {
            this.scene.fog = null;
        }

        // Обновляем видимость дождя
        this.rain.visible = this.currentWeather === 'rain';
    }

    updateRain(deltaTime) {
        // Перемещаем частицы дождя вниз
        const positions = this.rain.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 500 * deltaTime;
            if (positions[i] < 0) {
                positions[i] = 500;
            }
        }
        this.rain.geometry.attributes.position.needsUpdate = true;
    }
}