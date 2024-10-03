// core/Lighting.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Lighting {
    constructor(scene) {
        this.scene = scene;

        // Переменные для смены дня и ночи
        this.timeOfDay = 0;
        this.dayDuration = 60; // Продолжительность полного дня в секундах

        // Инициализация освещения
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(0, 10, 10);

        // Добавляем освещение в сцену
        this.scene.add(this.ambientLight);
        this.scene.add(this.directionalLight);
    }

    updateDayNightCycle(deltaTime) {
        // Обновляем время суток
        this.timeOfDay += deltaTime / this.dayDuration;
        if (this.timeOfDay >= 1) {
            this.timeOfDay = 0;
        }

        // Увеличиваем продолжительность ночи
        // Пусть ночь длится в два раза дольше дня
        const adjustedTime = (this.timeOfDay * 2) % 1; // Значение от 0 до 1

        // Вычисляем фактор дня
        let dayFactor;
        if (adjustedTime < 0.25) {
            // Рассвет
            dayFactor = adjustedTime / 0.25;
        } else if (adjustedTime < 0.75) {
            // День
            dayFactor = 1;
        } else {
            // Закат
            dayFactor = 1 - (adjustedTime - 0.75) / 0.25;
        }

        // Обновляем освещение
        this.ambientLight.intensity = 0.2 + 0.8 * dayFactor; // Интенсивность от 0.2 до 1.0
        this.directionalLight.intensity = 0.2 + 0.8 * dayFactor;

        // Настраиваем цвет направленного света для имитации рассвета/заката
        const dawnDuskColor = new THREE.Color(0xFF4500); // Оранжевый цвет
        const dayColor = new THREE.Color(0xffffff);
        if (dayFactor < 0.5) {
            // Рассвет
            const factor = dayFactor * 2; // От 0 до 1
            this.directionalLight.color.lerpColors(dawnDuskColor, dayColor, factor);
        } else if (dayFactor > 0.75) {
            // Закат
            const factor = (1 - dayFactor) * 4; // От 1 до 0
            this.directionalLight.color.lerpColors(dayColor, dawnDuskColor, factor);
        } else {
            // День
            this.directionalLight.color.set(0xffffff);
        }

        // Обновляем позицию направленного света в соответствии с положением солнца
        const sunAngle = adjustedTime * Math.PI * 2;
        this.directionalLight.position.set(
            Math.cos(sunAngle) * 100,
            Math.sin(sunAngle) * 100,
            0
        );
    }
}