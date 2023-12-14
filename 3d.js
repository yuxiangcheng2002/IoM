import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

document.addEventListener('DOMContentLoaded', function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 100);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threeContainer').appendChild(renderer.domElement);

    // Set background color to white
    renderer.setClearColor(0xffffff);

    // GLSL Vertex Shader
    const vertexShader = `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // GLSL Fragment Shader for Transition from Deep Pink to White
    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        vec3 deepPink = vec3(1.0, 0.08, 0.58);
        vec3 white = vec3(1.0, 1.0, 1.0);
        vec3 color = mix(deepPink, white, vUv.x);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Shader Material
    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            time: { value: 0.0 },
        },
    });

    // Cube Geometry
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2); // Cube geometry
    const cube = new THREE.Mesh(cubeGeometry, shaderMaterial);
    scene.add(cube);

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);

    // Inertia effect variables
    let isDragging = false;
    const baseRotationSpeed = 0.002; // Base rotation speed
    let additionalRotation = { x: 0, y: 0 }; // Additional rotation from inertia
    const inertiaDecay = 0.95; // Inertia decay factor

    controls.domElement.addEventListener('mousedown', () => isDragging = true);
    controls.domElement.addEventListener('mouseup', () => isDragging = false);
    controls.domElement.addEventListener('mouseout', () => isDragging = false);
    controls.domElement.addEventListener('mousemove', event => {
        if (isDragging) {
            additionalRotation.x = event.movementY * 0.0001;
            additionalRotation.y = -event.movementX * 0.0001;
        }
    });

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    function animate() {
        requestAnimationFrame(animate);

        shaderMaterial.uniforms.time.value += 0.01;

        cube.rotation.x += baseRotationSpeed + additionalRotation.x;
        cube.rotation.y += baseRotationSpeed + additionalRotation.y;

        if (!isDragging) {
            additionalRotation.x *= inertiaDecay;
            additionalRotation.y *= inertiaDecay;
        }

        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});