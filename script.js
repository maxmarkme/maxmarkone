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
