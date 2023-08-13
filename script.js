const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let isDistorted = false;
let storedImageData;

let draggingControlPoint = null;
let controlPoints = [
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
    } else if (isDistorted) {
        distortStart(e);
    } else {
        drawing = true;
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    draggingControlPoint = null;
    storeCurrentDrawing();
    ctx.beginPath();
    drawControlPoints();
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
    if (!drawing) return;
    ctx.lineWidth = 50; 
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    drawControlPoints();
}

function storeCurrentDrawing() {
    storedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function toggleDistortion() {
    isDistorted = !isDistorted;
    drawControlPoints();
}

function distortStart(event) {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const row = Math.floor(i / 4 / canvas.width);
        const col = (i / 4) % canvas.width;
        const dx = col - x;
        const dy = row - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
            const factor = (100 - dist) * 0.2;
            const newx = col + dx * factor;
            const newy = row + dy * factor;
            const newPixel = (Math.floor(newy) * canvas.width + Math.floor(newx)) * 4;
            data[i] = data[newPixel];
            data[i + 1] = data[newPixel + 1];
            data[i + 2] = data[newPixel + 2];
        }
    }

    ctx.putImageData(imageData, 0, 0);
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

// Initially draw the control points
drawControlPoints();
