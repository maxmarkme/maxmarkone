const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let storedImageData;
let draggingControlPoint = null;

const controlPoints = [
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
        ctx.moveTo(mouseX, mouseY);
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    draggingControlPoint = null;
    storeCurrentDrawing();
    drawControlPoints();
    applyDistortion();
});

canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    
    if (draggingControlPoint) {
        draggingControlPoint.x = mouseX;
        draggingControlPoint.y = mouseY;
        redrawCanvas();
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
}

function storeCurrentDrawing() {
    storedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function redrawCanvas() {
    ctx.putImageData(storedImageData, 0, 0);
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
    const texture = fx.canvas().texture(canvas);
    const canvasQuad = [0, 0, canvas.width, 0, canvas.width, canvas.height, 0, canvas.height];
    const quad = [
        controlPoints[0].x, controlPoints[0].y,
        controlPoints[1].x, controlPoints[1].y,
        controlPoints[2].x, controlPoints[2].y,
        controlPoints[3].x, controlPoints[3].y
    ];
    fx.canvas().draw(texture).perspective(canvasQuad, quad).update();
}

// Initially draw the control points
drawControlPoints();
