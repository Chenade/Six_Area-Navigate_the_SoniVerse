// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 40); // Set initial position along the z-axis
scene.add(camera);

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a wireframe cube
const cubeGeometry = new THREE.BoxGeometry(30, 30, 30);
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(cubeGeometry, wireframeMaterial);
scene.add(cube);

// Array to store sphere objects
const spheres = [];

//get local storage itmes
var local = localStorage.getItem("dataset");
let data = JSON.parse(local);
let color = {
    3.4: 0xff0000,
    4.6: 0x00ff00,
    12: 0xff00ff,
    22: 0xffff00
};

for (const [key, value] of Object.entries(data)) 
{
    for (const i in data[key]) 
    {
        const sphereGeometry = new THREE.SphereGeometry(0.1);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: color[key] });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(data[key][i].ra, data[key][i].dec, data[key][i].wavelength);
        cube.add(sphere);
        spheres.push(sphere);
    }
}

// Set up the controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Function to move all spheres together
function moveSpheres(deltaX, deltaY, deltaZ) {
    spheres.forEach(sphere => {
        sphere.position.x += deltaX;
        sphere.position.y += deltaY;
        sphere.position.z += deltaZ;
    });
}

// Function to change distance among spheres while maintaining their original ratios
function changeDistance(distanceChange) {
    const originalDistance = Math.abs(spheres[0].position.x - spheres[1].position.x);
    const newDistance = originalDistance + distanceChange;

    const ratio = newDistance / originalDistance;

    // Update positions of spheres to maintain their ratios
    spheres.forEach(sphere => {
        sphere.position.x *= ratio;
        sphere.position.y *= ratio;
        sphere.position.z *= ratio;
    });
}

function getDelta()
{
    console.log("getDelta");
    
}

// Set up animation
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Update controls in the animation loop

    renderer.render(scene, camera);
}

animate();
