// objects/Building.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js';

export class Building {
    constructor(x, z, side) {
        this.mesh = new THREE.Group();

        // Выбираем тип здания в зависимости от стороны дороги
        const buildingType = this.getRandomBuildingType(side);

        switch (buildingType) {
            case 'house':
                this.createHouse();
                break;
            case 'skyscraper':
                this.createSkyscraper();
                break;
            case 'shop':
                this.createShop();
                break;
            default:
                this.createHouse();
                break;
        }

        // Устанавливаем позицию здания
        this.mesh.position.set(x, 0, z);
    }

    getRandomBuildingType(side) {
        // Определяем возможные типы зданий для каждой стороны
        const leftSideTypes = ['house', 'shop'];
        const rightSideTypes = ['skyscraper', 'shop'];

        if (side === 'left') {
            return leftSideTypes[Math.floor(Math.random() * leftSideTypes.length)];
        } else {
            return rightSideTypes[Math.floor(Math.random() * rightSideTypes.length)];
        }
    }

    createHouse() {
        // Основание дома
        const houseGeometry = new THREE.BoxGeometry(2, 2, 2);
        const houseMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const house = new THREE.Mesh(houseGeometry, houseMaterial);
        house.position.y = 1;
        this.mesh.add(house);

        // Крыша
        const roofGeometry = new THREE.ConeGeometry(1.5, 1, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 2.5;
        roof.rotation.y = Math.PI / 4;
        this.mesh.add(roof);
    }

    createSkyscraper() {
        const height = Math.random() * 5 + 5; // Высота от 5 до 10
        const skyscraperGeometry = new THREE.BoxGeometry(3, height, 3);
        const skyscraperMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        const skyscraper = new THREE.Mesh(skyscraperGeometry, skyscraperMaterial);
        skyscraper.position.y = height / 2;
        this.mesh.add(skyscraper);
    }

    createShop() {
        // Основание магазина
        const shopGeometry = new THREE.BoxGeometry(3, 2, 2);
        const shopMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff7f });
        const shop = new THREE.Mesh(shopGeometry, shopMaterial);
        shop.position.y = 1;
        this.mesh.add(shop);

        // Вывеска
        const signGeometry = new THREE.PlaneGeometry(2, 1);
        const signMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.y = 2.5;
        sign.position.z = 1.01; // Чуть впереди фасада
        this.mesh.add(sign);
    }

    update(speed, cameraZ) {
        this.mesh.position.z += speed;
        if (this.mesh.position.z > cameraZ + 100) {
            this.mesh.position.z -= 1000;
        }
    }
}