// controllers/LineController.js
import { Line } from '../objects/Line.js';

export class LineController {
    constructor(scene) {
        this.scene = scene;
        this.lines = [];
        this.createLines();
    }

    createLines() {
        for (let i = 0; i < 200; i++) {
            const line = new Line(-i * 10);
            this.scene.add(line.mesh);
            this.lines.push(line);
        }
    }

    update(speed, cameraZ) {
        this.lines.forEach(line => {
            line.update(speed, cameraZ);
        });
    }
}