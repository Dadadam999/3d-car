// objects/Ground.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Ground {
    constructor(zPosition) {
        const groundGeometry = new THREE.PlaneGeometry(20, 1000);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Цвет травы
        this.mesh = new THREE.Mesh(groundGeometry, groundMaterial);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = -0.5;
        this.mesh.position.z = zPosition;
    }

    update(speed, cameraZ) {
        this.mesh.position.z += speed;
        if (this.mesh.position.z > cameraZ + 500) {
            this.mesh.position.z -= 2000;
        }
    }
}