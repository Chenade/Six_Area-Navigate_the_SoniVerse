let data = {};

if (sessionStorage.getItem("optical"))
{
    data["optical"] = JSON.parse(sessionStorage.getItem("optical"));
    sessionStorage.removeItem("optical");
}

if (sessionStorage.getItem("near-infrared"))
{
    data["near-infrared"] = JSON.parse(sessionStorage.getItem("near-infrared"));
    sessionStorage.removeItem("near-infrared");
}

if (sessionStorage.getItem("mid-infrared"))
{
    data["mid-infrared"] = JSON.parse(sessionStorage.getItem("mid-infrared"));
    sessionStorage.removeItem("mid-infrared");
}

if (sessionStorage.getItem("far-infrared"))
{
    data["far-infrared"] = JSON.parse(sessionStorage.getItem("far-infrared"));
    sessionStorage.removeItem("far-infrared");
}

let colors = {
    'optical': 0xff0000,
    'near-infrared': 0x00ff00,
    'mid-infrared': 0xff00ff,
    'far-infrared': 0xffff00
};

// Set up the scenes['mid-infrared']
let scenes = {};
scenes['near-infrared'] = new THREE.Scene();
scenes['near-infrared'].background = new THREE.Color(0x222222);
scenes['mid-infrared'] = new THREE.Scene();
scenes['mid-infrared'].background = new THREE.Color(0x222222);
scenes['far-infrared'] = new THREE.Scene();
scenes['far-infrared'].background = new THREE.Color(0x222222);
scenes['optical'] = new THREE.Scene();
scenes['optical'].background = new THREE.Color(0x222222);

let canvas = {};
canvas['near_infrared'] = document.getElementById('canvas-near-infrared');
canvas['mid_infrared'] = document.getElementById('canvas-mid-infrared');
canvas['far_infrared'] = document.getElementById('canvas-far-infrared');
canvas['optical'] = document.getElementById('canvas-optical');

// Set up the cameras
let cameras = {};
cameras['near-infrared'] = new THREE.PerspectiveCamera(75, canvas['near_infrared'].clientWidth / canvas['near_infrared'].clientHeight, 0.1, 1000);
cameras['near-infrared'].position.set(0, 0, 50);
scenes['near-infrared'].add(cameras['near-infrared']);
cameras['mid-infrared'] = new THREE.PerspectiveCamera(75, canvas['mid_infrared'].clientWidth / canvas['mid_infrared'].clientHeight, 0.1, 1000);
cameras['mid-infrared'].position.set(0, 0, 50);
scenes['mid-infrared'].add(cameras['mid-infrared']);
cameras['far-infrared'] = new THREE.PerspectiveCamera(75, canvas['far_infrared'].clientWidth / canvas['far_infrared'].clientHeight, 0.1, 1000);
cameras['far-infrared'].position.set(0, 0, 50);
scenes['far-infrared'].add(cameras['far-infrared']);
cameras['optical'] = new THREE.PerspectiveCamera(75, canvas['optical'].clientWidth / canvas['optical'].clientHeight, 0.1, 1000);
cameras['optical'].position.set(0, 0, 50);
scenes['optical'].add(cameras['optical']);

// Set up the renderer
let renderer = {};
renderer['near-infrared'] = new THREE.WebGLRenderer();
renderer['near-infrared'].setSize(canvas['near_infrared'].clientWidth, canvas['near_infrared'].clientHeight);
canvas['near_infrared'].appendChild(renderer['near-infrared'].domElement);
renderer['mid-infrared'] = new THREE.WebGLRenderer();
renderer['mid-infrared'].setSize(canvas['mid_infrared'].clientWidth, canvas['mid_infrared'].clientHeight);
canvas['mid_infrared'].appendChild(renderer['mid-infrared'].domElement);
renderer['far-infrared'] = new THREE.WebGLRenderer();
renderer['far-infrared'].setSize(canvas['far_infrared'].clientWidth, canvas['far_infrared'].clientHeight);
canvas['far_infrared'].appendChild(renderer['far-infrared'].domElement);
renderer['optical'] = new THREE.WebGLRenderer();
renderer['optical'].setSize(canvas['optical'].clientWidth, canvas['optical'].clientHeight);
canvas['optical'].appendChild(renderer['optical'].domElement);

let cube = {};
const boxSize = 30;
const cubeGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
cube['near-infrared'] = new THREE.Mesh(cubeGeometry, wireframeMaterial);
scenes['near-infrared'].add(cube['near-infrared']);

cube['mid-infrared'] = new THREE.Mesh(cubeGeometry, wireframeMaterial);
scenes['mid-infrared'].add(cube['mid-infrared']);

cube['far-infrared'] = new THREE.Mesh(cubeGeometry, wireframeMaterial);
scenes['far-infrared'].add(cube['far-infrared']);

cube['optical'] = new THREE.Mesh(cubeGeometry, wireframeMaterial);
scenes['optical'].add(cube['optical']);

const spheres = [];
// Create spheres for each data point
for (const [key, value] of Object.entries(data)) 
{
    for (const i in data[key]) 
    {
        const sphereGeometry = new  THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: colors[key] });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(data[key][i].ra, data[key][i].dec, data[key][i].wavelength);
        sphere.freqency = key;
        cube[key].add(sphere);
        spheres.push(sphere);
        // spheresByFrequency[key].push(sphere);
    }
}

// Set up the controls
let controls = {};

controls['near-infrared'] = new THREE.OrbitControls(cameras['near-infrared'], renderer['near-infrared'].domElement);
controls['near-infrared'].enableDamping = true;
controls['near-infrared'].dampingFactor = 0.25;
controls['near-infrared'].screenSpacePanning = false;
controls['near-infrared'].maxPolarAngle = Math.PI / 2;

controls['mid-infrared'] = new THREE.OrbitControls(cameras['mid-infrared'], renderer['mid-infrared'].domElement);
controls['mid-infrared'].enableDamping = true;
controls['mid-infrared'].dampingFactor = 0.25;
controls['mid-infrared'].screenSpacePanning = false;
controls['mid-infrared'].maxPolarAngle = Math.PI / 2;

controls['far-infrared'] = new THREE.OrbitControls(cameras['far-infrared'], renderer['far-infrared'].domElement);
controls['far-infrared'].enableDamping = true;
controls['far-infrared'].dampingFactor = 0.25;
controls['far-infrared'].screenSpacePanning = false;
controls['far-infrared'].maxPolarAngle = Math.PI / 2;

controls['optical'] = new THREE.OrbitControls(cameras['optical'], renderer['optical'].domElement);
controls['optical'].enableDamping = true;
controls['optical'].dampingFactor = 0.25;
controls['optical'].screenSpacePanning = false;
controls['optical'].maxPolarAngle = Math.PI / 2;

// Array to store text meshes
const textMeshes = [];

// Function to create text geometry
function createTextGeometry(text, position, scenes) {
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.rawgit.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 1, // Size of the text
            height: 0.1 // Extrusion thickness
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(position.x, position.y, position.z);
        scenes.add(textMesh);

        // Store the text mesh in the array for later access
        textMeshes.push(textMesh);
    });
}

// Create text labels for X, Y, and Z axes
createTextGeometry('ra', { x: boxSize / 2 + 1, y: -boxSize / 2 - 1, z: 0 }, scenes['near-infrared']);
createTextGeometry('dec', { x: boxSize / 2 + 1, y: 0, z: boxSize / 2 + 1 }, scenes['near-infrared']);
createTextGeometry('wavelength', { x: 0, y:  -boxSize / 2 - 1, z: boxSize / 2 + 1 }, scenes['near-infrared']);

// Create text labels for X, Y, and Z axes
createTextGeometry('ra', { x: boxSize / 2 + 1, y: -boxSize / 2 - 1, z: 0 }, scenes['mid-infrared']);
createTextGeometry('dec', { x: boxSize / 2 + 1, y: 0, z: boxSize / 2 + 1 }, scenes['mid-infrared']);
createTextGeometry('wavelength', { x: 0, y:  -boxSize / 2 - 1, z: boxSize / 2 + 1 }, scenes['mid-infrared']);

// Create text labels for X, Y, and Z axes
createTextGeometry('ra', { x: boxSize / 2 + 1, y: -boxSize / 2 - 1, z: 0 }, scenes['far-infrared']);
createTextGeometry('dec', { x: boxSize / 2 + 1, y: 0, z: boxSize / 2 + 1 }, scenes['far-infrared']);
createTextGeometry('wavelength', { x: 0, y:  -boxSize / 2 - 1, z: boxSize / 2 + 1 }, scenes['far-infrared']);

// Create text labels for X, Y, and Z axes
createTextGeometry('ra', { x: boxSize / 2 + 1, y: -boxSize / 2 - 1, z: 0 }, scenes['optical']);
createTextGeometry('dec', { x: boxSize / 2 + 1, y: 0, z: boxSize / 2 + 1 }, scenes['optical']);
createTextGeometry('wavelength', { x: 0, y:  -boxSize / 2 - 1, z: boxSize / 2 + 1 }, scenes['optical']);


// Set up animation
function animate() {
    requestAnimationFrame(animate);

    for (const [key, value] of Object.entries(controls)) {
        value.update();
    }
    textMeshes.forEach(textMesh => {
        textMesh.lookAt(cameras['mid-infrared'].position);
    });

    renderer['near-infrared'].render(scenes['near-infrared'], cameras['near-infrared']);
    renderer['mid-infrared'].render(scenes['mid-infrared'], cameras['mid-infrared']);
    renderer['far-infrared'].render(scenes['far-infrared'], cameras['far-infrared']);
    renderer['optical'].render(scenes['optical'], cameras['optical']);
}

animate();