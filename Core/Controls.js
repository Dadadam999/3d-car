// core/Controls.js

export class Controls {
    constructor(car) {
        this.car = car; // Сохраняем ссылку на объект машины
        this.moveLeft = false;
        this.moveRight = false;

        // Привязка методов, чтобы сохранить контекст this
        this.setupEventListeners = this.setupEventListeners.bind(this);

        // Инициализация после полной загрузки страницы
        window.addEventListener('DOMContentLoaded', this.setupEventListeners);
    }

    setupEventListeners() {
        const leftButton = document.getElementById('leftButton');
        const rightButton = document.getElementById('rightButton');

        // Если кнопки не найдены, выходим из метода
        if (!leftButton || !rightButton) {
            console.error('Кнопки управления не найдены в DOM.');
            return;
        }

        // Используем события pointerdown и pointerup для большей совместимости
        leftButton.addEventListener('pointerdown', () => {
            this.moveLeft = true;
        });
        leftButton.addEventListener('pointerup', () => {
            this.moveLeft = false;
        });

        rightButton.addEventListener('pointerdown', () => {
            this.moveRight = true;
        });
        rightButton.addEventListener('pointerup', () => {
            this.moveRight = false;
        });

        // Предотвращение прокрутки при касании кнопок
        leftButton.addEventListener('touchmove', (e) => e.preventDefault());
        rightButton.addEventListener('touchmove', (e) => e.preventDefault());
    }

    // Обновление состояния управления
    update() {
        // Передаем флаги в метод update() машины
        this.car.update(this.moveLeft, this.moveRight);
    }
}