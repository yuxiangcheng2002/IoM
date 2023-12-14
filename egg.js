import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, controls, scene, renderer;

init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    const eggcontainer = document.getElementById('eggContainer');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(eggcontainer.clientWidth, eggcontainer.clientHeight);
    eggcontainer.appendChild(renderer.domElement);

    // Set the camera position to face the light
    camera = new THREE.PerspectiveCamera(50, eggcontainer.clientWidth / eggcontainer.clientHeight, 1, 1000);
    camera.position.set(0, 300, 150); // Adjust the position as needed
    camera.lookAt(0, 0, 0); // Look at the center of the scene

    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 100;
    controls.maxDistance = 500;

    // Create cubes with deep pink material and group them
    const groups = [];

    for (let j = 0; j < 5; j++) {
        const group = new THREE.Group();
        scene.add(group);
        groups.push(group);

        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshPhongMaterial({ color: 0xff1493, flatShading: true });

        for (let i = 0; i < 200; i++) {
            const mesh = new THREE.Mesh(geometry, material);

            // Introduce additional randomness to cube positions
            mesh.position.x = (Math.random() - 0.5) * 400; // Adjust the range as needed
            mesh.position.y = (Math.random() - 0.5) * 400; // Adjust the range as needed
            mesh.position.z = (Math.random() - 0.5) * 400; // Adjust the range as needed

            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            group.add(mesh);
        }
    }

    // lights
    const deepPinkLight = new THREE.DirectionalLight(0xff1493, 3);
    deepPinkLight.position.set(1, 1, 1); // Set the light direction
    scene.add(deepPinkLight);

    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const eggcontainer = document.getElementById('eggContainer');
    const newWidth = eggcontainer.clientWidth;
    const newHeight = eggcontainer.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}
