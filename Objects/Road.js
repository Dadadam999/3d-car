// objects/Road.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Road {
    constructor(zPosition) {
        const roadGeometry = new THREE.PlaneGeometry(8, 1000);
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        this.mesh = new THREE.Mesh(roadGeometry, roadMaterial);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = 0.01; // Чуть выше земли
        this.mesh.position.z = zPosition;

        // Смена типа дороги
        this.changeRoadType();
    }

    update(speed, cameraZ) {
        this.mesh.position.z += speed;
        if (this.mesh.position.z > cameraZ + 500) {
            this.mesh.position.z -= 2000;
            this.changeRoadType();
        }
    }

    changeRoadType() {
        const roadTypes = [
            { color: 0x333333 }, // Обычная дорога
            { color: 0xAAAAAA }, // Серая полоса
            { color: 0x444444 }, // Темная полоса
        ];
        const randomType = roadTypes[Math.floor(Math.random() * roadTypes.length)];
        this.mesh.material.color.set(randomType.color);
    }
}