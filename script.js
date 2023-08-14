const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let draggingControlPoint = null;

const controlPoints = [
    { x: 0, y: 0 },
    { x: canvas.width, y: 0 },
    { x: canvas.width, y: canvas.height },
    { x: 0, y: canvas.height }
];

// Create a temporary canvas to store the original drawing
const tempCanvas = document.createElement('canvas');
tempCanvas.width = canvas.width;
tempCanvas.height = canvas.height;
const tempCtx = tempCanvas.getContext('2d');

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    const clickedPoint = getClickedControlPoint(mouseX, mouseY);
    
    if (clickedPoint) {
        draggingControlPoint = clickedPoint;
    } else {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    draggingControlPoint = null;
    tempCtx.drawImage(canvas, 0, 0);  // Store the current drawing on the temporary canvas
    applyDistortion();
});

canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    
    if (draggingControlPoint) {
        draggingControlPoint.x = mouseX;
        draggingControlPoint.y = mouseY;
        applyDistortion();
    } else if (drawing) {
        draw(e);
    }
});

function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = 50;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

function getClickedControlPoint(x, y) {
    const tolerance = 10;
    for (let point of controlPoints) {
        if (Math.abs(point.x - x) < tolerance && Math.abs(point.y - y) < tolerance) {
            return point;
        }
    }
    return null;
}

function applyDistortion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the main canvas
    ctx.drawImage(tempCanvas, 0, 0);  // Draw the original drawing from the temporary canvas onto the main canvas

    // Apply the distortion based on the control points' positions
    // [Your distortion logic here]

    drawControlPoints();  // Redraw the control points
}

function drawControlPoints() {
    ctx.fillStyle = 'red';
    for (let point of controlPoints) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Initialize the canvas by drawing the control points
drawControlPoints();
