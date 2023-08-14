const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let points = [];
let controlPoints = [
    { x: 0, y: 0 },
    { x: canvas.width, y: 0 },
    { x: canvas.width, y: canvas.height },
    { x: 0, y: canvas.height }
];

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    points.push({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        points.push({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
        draw();
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 50; 
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    for (let point of points) {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    }
    drawControlPoints();
}

function drawControlPoints() {
    ctx.fillStyle = 'red';
    for (let point of controlPoints) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function resetCanvas() {
    points = [];
    draw();
}

// Initially draw the control points
drawControlPoints();
