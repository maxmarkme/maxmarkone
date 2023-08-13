const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let distort = false;

canvas.addEventListener('mousedown', () => {
    drawing = true;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = 10; // This sets the thickness of the line
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

function toggleDistortion() {
    distort = !distort;
    if (distort) {
        ctx.setTransform(1, 0.5, -0.5, 1, 0, 0); // This is a basic skew for demonstration
    } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to default
    }
}

function saveDrawing() {
    alert('Save functionality to be implemented!');
}

function postToSocialMedia() {
    alert('Social media posting to be implemented!');
}
