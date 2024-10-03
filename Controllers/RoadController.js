// controllers/RoadController.js
import { Road } from '../objects/Road.js';

export class RoadController {
    constructor(scene) {
        this.scene = scene;
        this.roads = [];
        this.createRoads();
    }

    createRoads() {
        for (let i = 0; i < 2; i++) {
            const road = new Road(-500 - i * 1000);
            this.scene.add(road.mesh);
            this.roads.push(road);
        }
    }

    update(speed, cameraZ) {
        this.roads.forEach(road => {
            road.update(speed, cameraZ);
        });
    }
}