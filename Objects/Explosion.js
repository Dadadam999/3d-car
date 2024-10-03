// objects/Explosion.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Explosion {
    constructor(position) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff4500 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);

        this.lifetime = 1.0; // Время жизни взрыва в секундах
        this.elapsedTime = 0; // Счётчик времени
    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;

        // Увеличиваем размер взрыва со временем
        const scaleFactor = 1 + this.elapsedTime * 5;
        this.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Уменьшаем прозрачность (альфа-канал) со временем
        const opacity = 1.0 - (this.elapsedTime / this.lifetime);
        this.mesh.material.opacity = opacity;
        this.mesh.material.transparent = true;
    }

    isExpired() {
        return this.elapsedTime >= this.lifetime;
    }
}