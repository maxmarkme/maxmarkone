const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let isDistorted = false;
let storedImageData;

canvas.addEventListener('mousedown', () => {
    drawing = true;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    storeCurrentDrawing();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

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

function toggleDistortion() {
    if (isDistorted) {
        ctx.putImageData(storedImageData, 0, 0);
    } else {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Apply distortion effect (this is a basic example, you can customize as needed)
        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] = 255 - imgData.data[i];
            imgData.data[i + 1] = 255 - imgData.data[i + 1];
            imgData.data[i + 2] = 255 - imgData.data[i + 2];
        }
        ctx.putImageData(imgData, 0, 0);
    }
    isDistorted = !isDistorted;
}

function saveDrawing() {
    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'artwork.png';
    link.click();
    offerPhysicalArtwork();
    offerNFT();
}

function offerPhysicalArtwork() {
    const userResponse = confirm("Would you like to receive a physical version of your artwork?");
    if (userResponse) {
        alert("Redirecting to shipping details page...");
        // Redirect to a secure page where they can enter their shipping details
    }
    promptSocialMediaShare();
}

function promptSocialMediaShare() {
    const userResponse = confirm("Would you like to share your artwork on social media and spread the love?");
    if (userResponse) {
        alert("Redirecting to social media sharing page...");
        // Implement logic to share on social media and award the "Spread the Love" badge or discount
    }
}

function postToSocialMedia() {
    alert('Social media posting to be implemented!');
}

function offerNFT() {
    const userResponse = confirm("Would you like to purchase a 3D NFT version of your artwork?");
    if (userResponse) {
        alert("Redirecting to NFT purchase page...");
        // Redirect to NFT purchase page or implement NFT purchase logic here
    }
}
