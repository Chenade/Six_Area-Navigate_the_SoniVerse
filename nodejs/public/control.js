// Function to move all spheres together
function moveSpheres(deltaX, deltaY, deltaZ) {
    spheres.forEach(sphere => {
        sphere.position.x += deltaX;
        sphere.position.y += deltaY;
        sphere.position.z += deltaZ;
    });
}

// Function to change distance among spheres while maintaining their original ratios
function changeDistance(step) {
    // Adjust the distance among the spheres while keeping the ratio constant
    for (const sphere of spheres) {
        const currentPosition = sphere.position.clone();
        currentPosition.normalize(); // Normalize the vector to maintain direction
        const newPosition = currentPosition.multiplyScalar(step);
        sphere.position.add(newPosition);
    }
}

function resetView()
{
    for (const [key, _camera] of Object.entries(cameras))
    {
        _camera.position.set(0, 0, 50);
        _camera.rotation.set(0, 0, 0);
        controls[key].target.set(0, 0, 0);
        controls[key].dampingFactor = 0.25;
    }
}

let object = {};
let counter = {};

function filterSpheres()
{
    const _boxSize = boxSize / 2;
    const sphereRadius = 0.1;
    const numCategories = 90;
    const categorySize = 30 / numCategories; // Assuming z-coordinates range from -15 to 15


    spheres.forEach(sphere => {
        if (
            sphere.position.x + sphereRadius >= -_boxSize &&
            sphere.position.x - sphereRadius <= _boxSize &&
            sphere.position.y + sphereRadius >= -_boxSize &&
            sphere.position.y - sphereRadius <= _boxSize &&
            sphere.position.z + sphereRadius >= -_boxSize &&
            sphere.position.z - sphereRadius <= _boxSize
        )
        {
            sphere.material.color.set( colors[sphere.freqency]);
        }
        else
        {
            sphere.material.color.set(0x808080);
        }
    });
}

function submit()
{
    const _boxSize = boxSize / 2;
    const sphereRadius = 0.1;
    const numCategories = 90;
    const categorySize = 30 / numCategories;

    spheres.forEach(sphere => {
        if (
            sphere.position.x + sphereRadius >= -_boxSize &&
            sphere.position.x - sphereRadius <= _boxSize &&
            sphere.position.y + sphereRadius >= -_boxSize &&
            sphere.position.y - sphereRadius <= _boxSize &&
            sphere.position.z + sphereRadius >= -_boxSize &&
            sphere.position.z - sphereRadius <= _boxSize
        )
        {
            sphere.material.color.set( colors[sphere.freqency]);
            const categoryIndex = Math.floor((sphere.position.x + 15) / categorySize);
            if (!object[sphere.freqency]) object[sphere.freqency] = {};
            if (!object[sphere.freqency][categoryIndex]) object[sphere.freqency][categoryIndex] = [];
            object[sphere.freqency][categoryIndex].push([sphere.position.x, sphere.position.y, sphere.position.z]);
            if (!counter[sphere.freqency]) counter[sphere.freqency] = {};
            if (!counter[sphere.freqency][categoryIndex]) counter[sphere.freqency][categoryIndex] = 0;
            counter[sphere.freqency][categoryIndex] = (parseInt(counter[sphere.freqency][categoryIndex]) + 1);
        }
        else
        {
            sphere.material.color.set(0x808080);
        }
    });

    let dataset = {
        data: object,
        k: counter
    }

    console.log(dataset);  

    const jsonContent = JSON.stringify(dataset);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', blob, 'data.json');
    fetch('/kmeans', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        data = data.centroids;
        if (data.hasOwnProperty('optical')) sessionStorage.setItem('optical', JSON.stringify(data['optical']));
        if (data.hasOwnProperty('near-infrared')) sessionStorage.setItem('near-infrared', JSON.stringify(data['near-infrared']));
        if (data.hasOwnProperty('mid-infrared')) sessionStorage.setItem('mid-infrared', JSON.stringify(data['mid-infrared']));
        if (data.hasOwnProperty('far-infrared')) sessionStorage.setItem('far-infrared', JSON.stringify(data['far-infrared']));
        window.location.href = '/sound';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}