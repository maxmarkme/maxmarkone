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
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const output = ctx.createImageData(canvas.width, canvas.height);
    const outputData = output.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            
            const relPos = getRelativePosition(x, y, controlPoints);
            
            const srcX = relPos.x * canvas.width;
            const srcY = relPos.y * canvas.height;
            const srcPixel = bilinearInterpolation(data, srcX, srcY, canvas.width, canvas.height);
            
            outputData[i] = srcPixel[0];
            outputData[i + 1] = srcPixel[1];
            outputData[i + 2] = srcPixel[2];
            outputData[i + 3] = 255; // alpha
        }
    }

    ctx.putImageData(output, 0, 0);
}

function getRelativePosition(x, y, points) {
    return { x: x / canvas.width, y: y / canvas.height };
}

function bilinearInterpolation(data, x, y, width, height) {
    const x1 = Math.floor(x);
    const y1 = Math.floor(y);
    const x2 = x1 + 1;
    const y2 = y1 + 1;

    const f11 = getPixel(data, x1, y1, width);
    const f12 = getPixel(data, x1, y2, width);
    const f21 = getPixel(data, x2, y1, width);
    const f22 = getPixel(data, x2, y2, width);

    const r1 = ((x2 - x) / (x2 - x1)) * f11[0] + ((x - x1) / (x2 - x1)) * f21[0];
    const r2 = ((x2 - x) / (x2 - x1)) * f12[0] + ((x - x1) / (x2 - x1)) * f22[0];

    const g1 = ((x2 - x) / (x2 - x1)) * f11[1] + ((x - x1) / (x2 - x1)) * f21[1];
    const g2 = ((x2 - x) / (x2 - x1)) * f12[1] + ((x - x1) / (x2 - x1)) * f22[1];

    const b1 = ((x2 - x) / (x2 - x1)) * f11[2] + ((x - x1) / (x2 - x1)) * f21[2];
    const b2 = ((x2 - x) / (x2 - x1)) * f12[2] + ((x - x1) / (x2 - x1)) * f22[2];

    const r = ((y2 - y) / (y2 - y1)) * r1 + ((y - y1) / (y2 - y1)) * r2;
    const g = ((y2 - y) / (y2 - y1)) * g1 + ((y - y1) / (y2 - y1)) * g2;
    const b = ((y2 - y) / (y2 - y1)) * b1 + ((y - y1) / (y2 - y1)) * b2;

    return [r, g, b];
}

function getPixel(data, x, y, width) {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
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

drawControlPoints();
