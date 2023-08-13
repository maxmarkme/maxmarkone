const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let isDistorted = false;

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
    ctx.lineWidth = 50; // This sets the thickness of the line
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

function toggleDistortion() {
    if (isDistorted) {
        ctx.globalCompositeOperation = 'source-over'; // Default value
    } else {
        ctx.globalCompositeOperation = 'difference'; // This will create a "negative" effect on overlap
    }
    isDistorted = !isDistorted;
}

function saveDrawing() {
    alert('Save functionality to be implemented!');
}

function postToSocialMedia() {
    alert('Social media posting to be implemented!');
}
