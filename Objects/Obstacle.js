// objects/Obstacle.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Obstacle {
    constructor() {
        const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
        const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        this.mesh = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        this.mesh.position.x = (Math.random() - 0.5) * 6; // Ширина дороги
        this.mesh.position.y = 0.5;
        this.mesh.position.z = -200;
    }

    update(speed) {
        this.mesh.position.z += speed;
    }
}