const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let storedImageData;

let draggingControlPoint = null;
let controlPoints = [
    { x: 0, y: 0 },
    { x: canvas.width, y: 0 },
    { x: canvas.width, y: canvas.height },
    { x: 0, y: canvas.height }
];

let originalPoints = [
    { x: 0, y: 0 },
    { x: canvas.width, y: 0 },
    { x: canvas.width, y: canvas.height },
    { x: 0, y: canvas.height }
];

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    const clickedPoint = getClickedControlPoint(mouseX, mouseY);
    
    if (clickedPoint) {
        draggingControlPoint = clickedPoint;
    } else {
        drawing = true;
        ctx.beginPath();
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    draggingControlPoint = null;
    drawControlPoints();
    applyDistortion();
});

canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    
    if (draggingControlPoint) {
        draggingControlPoint.x = mouseX;
        draggingControlPoint.y = mouseY;
        drawControlPoints();
    } else if (drawing) {
        draw(e);
    }
});

function draw(event) {
    ctx.lineWidth = 5; 
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
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

function drawControlPoints() {
    ctx.fillStyle = 'red';
    for (let point of controlPoints) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function applyDistortion() {
    // Simple linear interpolation for distortion
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;

            const fx = (x / canvas.width);
            const fy = (y / canvas.height);

            const distortedX = lerp(originalPoints[0].x, originalPoints[1].x, fx);
            const distortedY = lerp(originalPoints[0].y, originalPoints[3].y, fy);

            const srcX = distortedX + (controlPoints[1].x - controlPoints[0].x) * fx + (controlPoints[3].x - controlPoints[0].x) * fy;
            const srcY = distortedY + (controlPoints[3].y - controlPoints[0].y) * fy + (controlPoints[1].y - controlPoints[0].y) * fx;

            const srcPixel = (Math.floor(srcY) * canvas.width + Math.floor(srcX)) * 4;

            data[i] = data[srcPixel];
            data[i + 1] = data[srcPixel + 1];
            data[i + 2] = data[srcPixel + 2];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// Initially draw the control points
drawControlPoints();
