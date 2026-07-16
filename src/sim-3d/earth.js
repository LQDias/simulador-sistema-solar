import * as THREE from 'three';

export class Terra3D {
    constructor(scene, orbitRadius) {
        this.scene = scene;
        this.orbitRadius = orbitRadius;

        const geometry = new THREE.SphereGeometry(0.8, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0x2233ff });
        this.mesh = new THREE.Mesh(geometry, material);

        this.group = new THREE.Group();
        this.group.add(this.mesh);

        const axialTilt = 23.5 * (Math.PI / 180);
        this.group.rotation.z = axialTilt;

        this.scene.add(this.group);
    }

    atualizar(dia, rotationSpeed) {
        // Rotação
        this.mesh.rotation.y += rotationSpeed;

        // Translação
        const anguloOrbita = ((dia - 80) / 365) * Math.PI * 2;
        this.group.position.x = Math.cos(anguloOrbita) * this.orbitRadius;
        this.group.position.z = Math.sin(anguloOrbita) * this.orbitRadius;
    }
}