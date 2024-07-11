import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let object;
let controls;
let objToRender = 'car1';

const loader = new GLTFLoader();

loader.load(
  `./${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    object.scale.set(60, 60, 60); // Adjust scale if model is too small
    object.position.set(0, 0, 0); // Ensure the model is centered
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.z = 500;

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x555555); // Brighter ambient light
scene.add(ambientLight);

const additionalLight = new THREE.PointLight(0xffffff, 0.5); // Additional point light
additionalLight.position.set(0, 200, 200);
scene.add(additionalLight);

controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  if (object) {
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

// Function to fetch JSON data and update car position
async function fetchAndUpdatePosition() {
  try {
    const response = await fetch('path_to_your_json_endpoint'); // Update this with your JSON endpoint
    const data = await response.json();
    const { ax, ay, az } = data;
    if (object) {
      object.position.set(ax, ay, az);
    }
  } catch (error) {
    console.error('Error fetching or updating position:', error);
  }
}

// Periodically fetch and update car position
setInterval(fetchAndUpdatePosition, 1000); // Fetch every second

animate();
