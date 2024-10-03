// controllers/ExplosionController.js
import { Explosion } from '../objects/Explosion.js';

export class ExplosionController {
    constructor(scene) {
        this.scene = scene;
        this.explosions = [];
    }

    createExplosion(position) {
        const explosion = new Explosion(position);
        this.scene.add(explosion.mesh);
        this.explosions.push(explosion);
    }

    update(deltaTime) {
        this.explosions.forEach((explosion, index) => {
            explosion.update(deltaTime);

            // Удаляем взрыв, если он закончился
            if (explosion.isExpired()) {
                this.scene.remove(explosion.mesh);
                this.explosions.splice(index, 1);
            }
        });
    }
}