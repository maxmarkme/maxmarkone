// Assuming Three.js is already included in your project

let scene, camera, renderer, plane, isDrawing = false, controlPoints = [], drawingTexture, textureData;
const textureSize = 512;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a plane for drawing
    let geometry = new THREE.PlaneGeometry(5, 5);
    textureData = new Uint8Array(textureSize * textureSize * 3);
    drawingTexture = new THREE.DataTexture(textureData, textureSize, textureSize, THREE.RGBFormat);
    let material = new THREE.MeshBasicMaterial({ map: drawingTexture });
    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Control points
    for (let i = 0; i < 4; i++) {
        let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        controlPoints.push(sphere);
        scene.add(sphere);
    }
    positionControlPoints();

    // Drag controls
    let dragControls = new THREE.DragControls(controlPoints, camera, renderer.domElement);
    dragControls.addEventListener('drag', updateDistortion);

    // Event listeners for drawing
    renderer.domElement.addEventListener('mousedown', startDrawing);
    renderer.domElement.addEventListener('mousemove', draw);
    renderer.domElement.addEventListener('mouseup', stopDrawing);

    animate();
}

function positionControlPoints() {
    controlPoints[0].position.set(-2.5, 2.5, 0);
    controlPoints[1].position.set(2.5, 2.5, 0);
    controlPoints[2].position.set(2.5, -2.5, 0);
    controlPoints[3].position.set(-2.5, -2.5, 0);
}

function startDrawing(event) {
    isDrawing = true;
}

function draw(event) {
    if (!isDrawing) return;
    // Logic to draw on the texture
    drawingTexture.needsUpdate = true;
}

function stopDrawing(event) {
    isDrawing = false;
}

function updateDistortion() {
    // Logic to update the plane's geometry based on control points' positions
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
