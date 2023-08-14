let canvas = document.getElementById('artCanvas');
let ctx = canvas.getContext('2d');
let drawing = false;
let storedImageData;
let draggingControlPoint = null;

const controlPoints = [
    { x: 0, y: 0 },
    { x: canvas.width, y: 0 },
    { x: canvas.width, y: canvas.height },
    { x: 0, y: canvas.height }
];

function initialize() {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    drawControlPoints();
}

function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

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

function endDrawing() {
    drawing = false;
    applyDistortion();
}

function applyDistortion() {
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, 
        [0, 0, canvas.width, 0, canvas.width, canvas.height, 0, canvas.height]);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, 
        [controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, 
        controlPoints[2].x, controlPoints[2].y, controlPoints[3].x, controlPoints[3].y]);
    let warpMat = cv.getPerspectiveTransform(srcTri, dstTri);
    let dsize = new cv.Size(canvas.width, canvas.height);
    let src = cv.imread(canvas);
    let dst = new cv.Mat();
    cv.warpPerspective(src, dst, warpMat, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    cv.imshow(canvas, dst);
    src.delete();
    dst.delete();
    warpMat.delete();
}

function drawControlPoints() {
    ctx.fillStyle = 'red';
    for (let point of controlPoints) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}
