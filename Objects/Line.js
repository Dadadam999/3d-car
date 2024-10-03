// objects/Line.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Line {
    constructor(zPosition) {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.2, 10),
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
        );
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = 0.02;
        this.mesh.position.z = zPosition;
    }

    update(speed, cameraZ) {
        this.mesh.position.z += speed;
        if (this.mesh.position.z > cameraZ + 10) {
            this.mesh.position.z -= 2000;
        }
    }
}