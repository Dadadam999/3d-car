// controllers/BuildingController.js
import { Building } from '../objects/Building.js';

export class BuildingController {
    constructor(scene) {
        this.scene = scene;
        this.buildings = [];
        this.createBuildings();
    }

    createBuildings() {
        for (let i = 0; i < 10; i++) {
            const zPosition = -i * 100;

            // Левые здания
            const buildingLeft = new Building(-5, zPosition, 'left');
            this.scene.add(buildingLeft.mesh);
            this.buildings.push(buildingLeft);

            // Правые здания
            const buildingRight = new Building(5, zPosition, 'right');
            this.scene.add(buildingRight.mesh);
            this.buildings.push(buildingRight);
        }
    }

    update(speed, cameraZ) {
        this.buildings.forEach(building => {
            building.update(speed, cameraZ);
        });
    }
}