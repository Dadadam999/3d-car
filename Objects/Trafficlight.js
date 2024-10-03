// objects/TrafficLight.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class TrafficLight {
    constructor(x, z) {
        this.group = new THREE.Group();

        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 16);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(0, 1.5, 0);
        this.group.add(pole);

        const lightGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
        const lightMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(0, 3, 0);
        this.group.add(light);

        this.group.position.set(x, 0, z);
    }

    update(speed, cameraZ) {
        this.group.position.z += speed;
        if (this.group.position.z > cameraZ + 100) {
            this.group.position.z -= 1000;
        }
    }
}