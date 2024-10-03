// core/UI.js

export class UI {
    constructor() {
        // Инициализация элементов интерфейса
        this.livesElement = document.getElementById('lives');
        this.speedElement = document.getElementById('speed');
    }

    update(lives, speed) {
        this.livesElement.textContent = `Жизни: ${lives}`;
        this.speedElement.textContent = `Скорость: ${Math.round(speed * 100)}`;
    }
}