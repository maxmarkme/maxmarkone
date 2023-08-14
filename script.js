let canvas = new fabric.Canvas('artCanvas');
let isDrawing = false;
let group;

canvas.isDrawingMode = true;
canvas.freeDrawingBrush.width = 50;
canvas.freeDrawingBrush.color = "#000000";

canvas.on('path:created', function() {
    if (group) {
        canvas.remove(group);
    }
    let paths = canvas.getObjects('path');
    group = new fabric.Group(paths, {
        cornerColor: 'red',
        borderColor: 'red',
        cornerSize: 10,
        transparentCorners: false,
    });
    canvas.add(group);
    paths.forEach(path => canvas.remove(path));
});

function saveDrawing() {
    // Placeholder for save drawing logic
}

function postToSocialMedia() {
    // Placeholder for post to social media logic
}
