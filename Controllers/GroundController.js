// controllers/GroundController.js
import { Ground } from '../objects/Ground.js';

export class GroundController {
    constructor(scene) {
        this.scene = scene;
        this.grounds = [];
        this.createGrounds();
    }

    createGrounds() {
        for (let i = 0; i < 2; i++) {
            const ground = new Ground(-500 - i * 1000);
            this.scene.add(ground.mesh);
            this.grounds.push(ground);
        }
    }

    update(speed, cameraZ) {
        this.grounds.forEach(ground => {
            ground.update(speed, cameraZ);
        });
    }
}