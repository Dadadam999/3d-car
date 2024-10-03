// controllers/TrafficLightController.js
import { TrafficLight } from '../objects/TrafficLight.js';

export class TrafficLightController {
    constructor(scene) {
        this.scene = scene;
        this.trafficLights = [];
        this.createTrafficLights();
    }

    createTrafficLights() {
        for (let i = 0; i < 5; i++) {
            const lightLeft = new TrafficLight(-3.5, -i * 200);
            const lightRight = new TrafficLight(3.5, -i * 200);
            this.scene.add(lightLeft.group);
            this.scene.add(lightRight.group);
            this.trafficLights.push(lightLeft, lightRight);
        }
    }

    update(speed, cameraZ) {
        this.trafficLights.forEach(light => {
            light.update(speed, cameraZ);
        });
    }
}

