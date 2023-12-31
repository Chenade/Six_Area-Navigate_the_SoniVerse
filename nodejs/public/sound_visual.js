setTimeout(() => {
  document.getElementById("loading").style.display = "none";
}, 5000);

let info = {
  "m4": {"name": "Messier 4 (m4)", "img": "./img/m4.png"},
  "m16": {"name": "Messier 16 (m16)", "img": "./img/m16.png"},
  "m80": {"name": "Messier 80 (m80)", "img": "./img/m80.png"},
  "others": {"name": "Own Data", "img": "./img/logo.jpg"}
}

let colors = {
    'W1': 0x00b1fe,
    'W2': 0xeb3f3f,
    'W3': 0x8c00f7,
    'W4': 0xffff00
};

let id = sessionStorage.getItem("target");
if (!id) id = "m4";
document.getElementById("target_title").innerHTML = info[id].name;
document.getElementById("target_image").src = info[id].img;
if (id == "others")
  document.getElementById("scanner").style.display = "none";

const scenes = new THREE.Scene();
scenes.background = new THREE.Color(0x222222);
const canvas = document.getElementById('canvas-optical')
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 25);
scenes.add(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
canvas.appendChild(renderer.domElement);

const boxSize = 30;
const cubeGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
const cube = new THREE.Mesh(cubeGeometry, wireframeMaterial);
scenes.add(cube);

let spheres = [];

for (const [key, value] of Object.entries(data))
{
    for (const i in data[key])
    {
        for (const j in data[key][i])
        {
            const sphereGeometry = new THREE.SphereGeometry(0.1);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: colors[key] });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            if (data[key][i][j])
                sphere.position.set(data[key][i][j][0], data[key][i][j][1], data[key][i][j][2]);
            sphere.freqency = key;
            cube.add(sphere);
            spheres.push(sphere);
        }
    }
}

cube.rotation.y = Math.PI / 2;

const scanner = document.getElementById('scanner');

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scenes, camera);
    if (start && camera.position.z > -15)
    {
        camera.position.z -= 0.005;
        scanner.style.left = (parseFloat(scanner.style.left) + 0.05) + 'px';
    }
}

animate();